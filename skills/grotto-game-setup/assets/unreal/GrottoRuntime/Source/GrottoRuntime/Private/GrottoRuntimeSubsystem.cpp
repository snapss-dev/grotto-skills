#include "GrottoRuntimeSubsystem.h"
#include "Async/Async.h"
#include "Dom/JsonObject.h"
#include "HAL/FileManager.h"
#include "Misc/FileHelper.h"
#include "Misc/Paths.h"
#include "Serialization/JsonReader.h"
#include "Serialization/JsonSerializer.h"
#include "Windows/WindowsHWrapper.h"
#include <winhttp.h>

namespace
{
bool SafeName(const FString& Value, int32 Limit = 64)
{
    if (Value.IsEmpty() || Value.Len() > Limit) return false;
    for (TCHAR C : Value) if (!FChar::IsAlnum(C) || C > 127)
        if (C != TEXT('_') && C != TEXT('-')) return false;
    return true;
}
bool Hex(const FString& Value, int32 Length)
{
    if (Value.Len() != Length) return false;
    for (TCHAR C : Value) if (!FChar::IsHexDigit(C) || FChar::IsUpper(C)) return false;
    return true;
}
TSharedPtr<FJsonObject> Object(const FString& Json)
{
    TSharedPtr<FJsonObject> Value;
    FJsonSerializer::Deserialize(TJsonReaderFactory<>::Create(Json), Value);
    return Value;
}
FString Encode(const TSharedRef<FJsonObject>& Value)
{
    FString Json;
    FJsonSerializer::Serialize(Value, TJsonWriterFactory<>::Create(&Json));
    return Json;
}
bool JsonState(const FString& Json)
{
    if (FTCHARToUTF8(*Json).Length() > 256 * 1024) return false;
    TSharedPtr<FJsonValue> Value;
    return FJsonSerializer::Deserialize(TJsonReaderFactory<>::Create(Json), Value)
        && Value.IsValid() && (Value->Type == EJson::Object || Value->Type == EJson::Array);
}
bool AllowedOrigin(const FString& Origin)
{
    if (Origin == TEXT("https://api.enterthegrotto.xyz")) return true;
#if !UE_BUILD_SHIPPING
    // Explicit local fixture lane; never allow arbitrary HTTP/HTTPS hosts.
    const FString Prefix = TEXT("http://127.0.0.1:");
    if (Origin.StartsWith(Prefix))
    {
        const FString Port = Origin.Mid(Prefix.Len());
        if (!Port.IsEmpty() && Port.Len() <= 5 && Port.IsNumeric())
            return FCString::Atoi(*Port) > 0 && FCString::Atoi(*Port) <= 65535;
    }
#endif
    return false;
}
// WinHTTP preserves certificate verification and disables redirects before
// sending a bearer. No engine HTTP diagnostics or credential-bearing URLs.
TPair<int32, FString> Http(const FString& Origin, const FString& Path, const FString& Verb,
    const FString& Body, const FString& Token)
{
    FString Host = TEXT("api.enterthegrotto.xyz");
    INTERNET_PORT Port = INTERNET_DEFAULT_HTTPS_PORT;
    const bool Secure = Origin.StartsWith(TEXT("https:"));
    if (!Secure) { Host = TEXT("127.0.0.1"); Port = (INTERNET_PORT)FCString::Atoi(*Origin.Mid(17)); }
    HINTERNET Session = WinHttpOpen(L"GrottoRuntime/0.1", WINHTTP_ACCESS_TYPE_NO_PROXY,
        WINHTTP_NO_PROXY_NAME, WINHTTP_NO_PROXY_BYPASS, 0);
    if (!Session) return {0, TEXT("")};
    WinHttpSetTimeouts(Session, 2000, 2000, 5000, 5000);
    HINTERNET Connection = WinHttpConnect(Session, *Host, Port, 0);
    HINTERNET Call = Connection ? WinHttpOpenRequest(Connection, *Verb, *Path, nullptr,
        WINHTTP_NO_REFERER, WINHTTP_DEFAULT_ACCEPT_TYPES, Secure ? WINHTTP_FLAG_SECURE : 0) : nullptr;
    TPair<int32, FString> Result(0, TEXT(""));
    if (Call)
    {
        DWORD RedirectPolicy = WINHTTP_OPTION_REDIRECT_POLICY_NEVER;
        if (WinHttpSetOption(Call, WINHTTP_OPTION_REDIRECT_POLICY, &RedirectPolicy, sizeof(RedirectPolicy)))
        {
            const FString Headers = TEXT("Content-Type: application/json\r\nCache-Control: no-store\r\n")
                + (Token.IsEmpty() ? TEXT("") : TEXT("Authorization: Bearer ") + Token + TEXT("\r\n"));
            FTCHARToUTF8 Bytes(*Body);
            if (WinHttpSendRequest(Call, *Headers, (DWORD)-1, Bytes.Length() ? (void*)Bytes.Get() : nullptr,
                Bytes.Length(), Bytes.Length(), 0) && WinHttpReceiveResponse(Call, nullptr))
            {
                DWORD Status = 0, Size = sizeof(Status);
                WinHttpQueryHeaders(Call, WINHTTP_QUERY_STATUS_CODE | WINHTTP_QUERY_FLAG_NUMBER,
                    WINHTTP_HEADER_NAME_BY_INDEX, &Status, &Size, WINHTTP_NO_HEADER_INDEX);
                TArray<uint8> Data;
                bool Valid = true;
                for (;;)
                {
                    DWORD Available = 0, Read = 0;
                    if (!WinHttpQueryDataAvailable(Call, &Available)) { Valid = false; break; }
                    if (!Available) break;
                    if (Data.Num() + Available > 1024 * 1024) { Valid = false; break; }
                    const int32 Offset = Data.Num(); Data.AddUninitialized(Available);
                    if (!WinHttpReadData(Call, Data.GetData() + Offset, Available, &Read)) { Valid = false; break; }
                    Data.SetNum(Offset + Read);
                }
                if (Valid) { Data.Add(0); Result = { (int32)Status, UTF8_TO_TCHAR((const char*)Data.GetData()) }; }
            }
        }
        WinHttpCloseHandle(Call);
    }
    if (Connection) WinHttpCloseHandle(Connection);
    WinHttpCloseHandle(Session);
    return Result;
}
}

void UGrottoRuntimeSubsystem::InitializeGrotto(const FString& ExpectedGameId)
{
    if (bInitialized) return; // Account replacement requires a fresh game process.
    bInitialized = true;
    if (!SafeName(ExpectedGameId, 120)) { Offline(TEXT("invalid_game")); return; }
    GameId = ExpectedGameId;
    HANDLE Input = GetStdHandle(STD_INPUT_HANDLE), Copy = nullptr;
    if (!Input || Input == INVALID_HANDLE_VALUE || GetFileType(Input) != FILE_TYPE_PIPE
        || !DuplicateHandle(GetCurrentProcess(), Input, GetCurrentProcess(), &Copy, 0, false, DUPLICATE_SAME_ACCESS))
    { Offline(TEXT("launcher_absent")); return; }
    // Do not let a subprocess accidentally inherit the launch capability.
    SetHandleInformation(Input, HANDLE_FLAG_INHERIT, 0);
    Pipe = Copy;
    BootDeadline = FPlatformTime::Seconds() + 5;
    State = EGrottoSessionState::Connecting;
    OnSessionChanged.Broadcast(State, TEXT("launching"));
    // Cold engine initialization can delay the first world tick. Consume the
    // already-buffered frame now, before its short-lived capability expires.
    Tick(0);
}

void UGrottoRuntimeSubsystem::Tick(float DeltaTime)
{
    if (Pipe)
    {
        DWORD Available = 0;
        if (!PeekNamedPipe((HANDLE)Pipe, nullptr, 0, nullptr, &Available, nullptr))
        { Offline(TEXT("launcher_disconnected")); return; }
        if (State == EGrottoSessionState::Connecting && ApiBaseUrl.IsEmpty())
        {
            if (Available)
            {
                if (Frame.Len() + Available > 8192) { Offline(TEXT("invalid_launch")); return; }
                TArray<ANSICHAR> Bytes; Bytes.SetNumZeroed(Available + 1); DWORD Read = 0;
                if (!ReadFile((HANDLE)Pipe, Bytes.GetData(), Available, &Read, nullptr)) { Offline(TEXT("invalid_launch")); return; }
                Frame += UTF8_TO_TCHAR(Bytes.GetData());
                if (Frame.EndsWith(TEXT("\n"))) { FString Json = MoveTemp(Frame); Exchange(Json); }
            }
            if (ApiBaseUrl.IsEmpty() && FPlatformTime::Seconds() >= BootDeadline) Offline(TEXT("launch_timeout"));
        }
        else if (Available) Offline(TEXT("unexpected_launch_data"));
    }
    if (State == EGrottoSessionState::Authenticated)
    {
        if (FDateTime::UtcNow() >= ExpiresAt) { Offline(TEXT("session_expired")); return; }
        if (FPlatformTime::Seconds() >= NextHeartbeat) { NextHeartbeat = FPlatformTime::Seconds() + 30; Heartbeat(); }
    }
}

void UGrottoRuntimeSubsystem::Exchange(const FString& Json)
{
    const auto Launch = Object(Json);
    FString Protocol, Expected, Hash, Ticket, Origin;
    if (!Launch || Launch->Values.Num() != 5 || !Launch->TryGetStringField(TEXT("protocol"), Protocol)
        || Protocol != TEXT("grotto-native-v1") || !Launch->TryGetStringField(TEXT("gameId"), Expected) || Expected != GameId
        || !Launch->TryGetStringField(TEXT("buildSha256"), Hash) || !Hex(Hash, 64)
        || !Launch->TryGetStringField(TEXT("ticket"), Ticket) || !Ticket.StartsWith(TEXT("glt_")) || Ticket.Len() != 84
        || !Launch->TryGetStringField(TEXT("apiBaseUrl"), Origin) || !AllowedOrigin(Origin))
    { Offline(TEXT("invalid_launch")); return; }
    ApiBaseUrl = Origin;
    auto Body = MakeShared<FJsonObject>(); Body->SetStringField(TEXT("ticket"), Ticket);
    Body->SetStringField(TEXT("gameId"), GameId); Body->SetStringField(TEXT("buildSha256"), Hash);
    Send(TEXT("POST"), TEXT("/native/exchange"), Encode(Body), TEXT(""), [this](int32 Status, const FString& Response)
    {
        const auto Value = Object(Response); FString Id, Token, Expiry, ReturnedGame;
        if (Status != 200 || !Value || !Value->TryGetStringField(TEXT("gameId"), ReturnedGame) || ReturnedGame != GameId
            || !Value->TryGetStringField(TEXT("playerId"), Id) || !Id.StartsWith(TEXT("0x")) || !Hex(Id.Mid(2), 40)
            || !Value->TryGetStringField(TEXT("sessionId"), Token) || !Token.StartsWith(TEXT("grs_")) || Token.Len() != 47
            || !Value->TryGetStringField(TEXT("expiresAt"), Expiry) || !FDateTime::ParseIso8601(*Expiry, ExpiresAt))
        { Offline(TEXT("exchange_failed")); return; }
        SessionToken = Token; Player.Id = Id;
        Send(TEXT("GET"), TEXT("/session/me"), TEXT(""), SessionToken, [this](int32 Code, const FString& Profile)
        {
            const auto Me = Object(Profile); const TSharedPtr<FJsonObject>* P = nullptr; FString Id;
            if (Code != 200 || !Me || !Me->TryGetObjectField(TEXT("player"), P)
                || !(*P)->TryGetStringField(TEXT("id"), Id) || Id != Player.Id) { Offline(TEXT("identity_unavailable")); return; }
            (*P)->TryGetStringField(TEXT("displayName"), Player.DisplayName);
            (*P)->TryGetStringField(TEXT("avatar"), Player.Avatar);
            State = EGrottoSessionState::Authenticated; NextHeartbeat = FPlatformTime::Seconds() + 30;
            OnSessionChanged.Broadcast(State, TEXT("ready"));
        });
    });
}

void UGrottoRuntimeSubsystem::Send(const FString& Verb, const FString& RelativePath, const FString& Body,
    const FString& Token, TFunction<void(int32, const FString&)> Complete)
{
    if (!AllowedOrigin(ApiBaseUrl) || PendingRequests >= 8) { Complete(0, TEXT("{}")); return; }
    const int32 Epoch = Generation; ++PendingRequests;
    TWeakObjectPtr<UGrottoRuntimeSubsystem> Weak(this); const FString Origin = ApiBaseUrl;
    Async(EAsyncExecution::ThreadPool, [Weak, Epoch, Origin, Verb, RelativePath, Body, Token, Complete = MoveTemp(Complete)]() mutable
    {
        auto Result = Http(Origin, TEXT("/api/game-runtime/v1") + RelativePath, Verb, Body, Token);
        AsyncTask(ENamedThreads::GameThread, [Weak, Epoch, Result = MoveTemp(Result), Complete = MoveTemp(Complete)]() mutable
        {
            if (!Weak.IsValid()) return;
            auto* Self = Weak.Get(); Self->PendingRequests = FMath::Max(0, Self->PendingRequests - 1);
            if (Epoch == Self->Generation) Complete(Result.Key, Result.Value);
        });
    });
}

void UGrottoRuntimeSubsystem::Request(const FString& Verb, const FString& RelativePath, const FString& Body, const FString& RequestId)
{
    if (State != EGrottoSessionState::Authenticated) { OnResponse.Broadcast(RequestId, 0, TEXT("{\"code\":\"RUNTIME_OFFLINE\"}")); return; }
    Send(Verb, RelativePath, Body, SessionToken, [this, RequestId](int32 Code, const FString& Json)
    {
        if (Code == 401 || Code == 403) { Offline(TEXT("session_unavailable")); return; }
        // Never expose the bearer via a Blueprint event/serializable property.
        const auto Value = Object(Json);
        if (Value) Value->RemoveField(TEXT("sessionId"));
        OnResponse.Broadcast(RequestId, Code, Value ? Encode(Value.ToSharedRef()) : TEXT("{}"));
    });
}

void UGrottoRuntimeSubsystem::ReadSave(const FString& Slot, const FString& RequestId)
{ if (SafeName(Slot)) Request(TEXT("GET"), TEXT("/saves/") + Slot, TEXT(""), RequestId); }
void UGrottoRuntimeSubsystem::DeleteSave(const FString& Slot, const FString& RequestId)
{ if (SafeName(Slot)) Request(TEXT("DELETE"), TEXT("/saves/") + Slot, TEXT("{}"), RequestId); }
void UGrottoRuntimeSubsystem::WriteSave(const FString& Slot, int32 BaseVersion, const FString& StateJson, const FString& RequestId)
{
    if (!SafeName(Slot) || BaseVersion < 0 || !JsonState(StateJson)) { OnResponse.Broadcast(RequestId, 400, TEXT("{\"code\":\"SAVE_WRITE_INVALID\"}")); return; }
    const FString Body = FString::Printf(TEXT("{\"baseVersion\":%d,\"state\":%s}"), BaseVersion, *StateJson);
    Request(TEXT("PUT"), TEXT("/saves/") + Slot, Body, RequestId);
}
void UGrottoRuntimeSubsystem::SendEvent(const FString& Type, const FString& PayloadJson, const FString& RequestId)
{
    const auto Payload = Object(PayloadJson);
    if (!SafeName(Type) || !Payload || FTCHARToUTF8(*PayloadJson).Length() > 16 * 1024) { OnResponse.Broadcast(RequestId, 400, TEXT("{\"code\":\"RUNTIME_EVENT_INVALID\"}")); return; }
    auto Body = MakeShared<FJsonObject>(); Body->SetStringField(TEXT("type"), Type); Body->SetObjectField(TEXT("payload"), Payload);
    Request(TEXT("POST"), TEXT("/events"), Encode(Body), RequestId);
}
void UGrottoRuntimeSubsystem::Heartbeat()
{
    if (State != EGrottoSessionState::Authenticated) return;
    Send(TEXT("POST"), TEXT("/session/heartbeat"), TEXT("{}"), SessionToken, [this](int32 Code, const FString& Json)
    {
        const auto Value = Object(Json); FString Expiry;
        if (Code != 200 || !Value || !Value->TryGetStringField(TEXT("expiresAt"), Expiry)
            || !FDateTime::ParseIso8601(*Expiry, ExpiresAt)) { Offline(TEXT("heartbeat_unavailable")); }
    });
}
void UGrottoRuntimeSubsystem::Offline(const FString& Reason)
{
    ++Generation; Frame.Reset(); SessionToken.Reset(); Player = {}; ApiBaseUrl.Reset();
    if (Pipe) { CloseHandle((HANDLE)Pipe); Pipe = nullptr; }
    if (State != EGrottoSessionState::Ended) State = EGrottoSessionState::Offline;
    OnSessionChanged.Broadcast(State, Reason);
}
void UGrottoRuntimeSubsystem::EndSession()
{
    if (State == EGrottoSessionState::Ended) return;
    if (!SessionToken.IsEmpty()) Send(TEXT("POST"), TEXT("/session/end"), TEXT("{}"), SessionToken, [](int32, const FString&) {});
    State = EGrottoSessionState::Ended; Offline(TEXT("ended"));
}
void UGrottoRuntimeSubsystem::Deinitialize() { EndSession(); Super::Deinitialize(); }
FString UGrottoRuntimeSubsystem::LocalPath(const FString& Slot) const
{
    if (!SafeName(Slot) || !SafeName(GameId, 120)) return TEXT("");
    const FString Scope = State == EGrottoSessionState::Authenticated ? Player.Id : TEXT("offline");
    return FPaths::Combine(FPaths::ProjectSavedDir(), TEXT("Grotto"), GameId, Scope, Slot + TEXT(".json"));
}
bool UGrottoRuntimeSubsystem::WriteLocalSave(const FString& Slot, const FString& StateJson)
{
    const FString File = LocalPath(Slot);
    if (File.IsEmpty() || !JsonState(StateJson)) return false;
    IFileManager::Get().MakeDirectory(*FPaths::GetPath(File), true);
    const FString Temporary = File + TEXT(".tmp");
    return FFileHelper::SaveStringToFile(StateJson, *Temporary, FFileHelper::EEncodingOptions::ForceUTF8WithoutBOM)
        && IFileManager::Get().Move(*File, *Temporary, true, true);
}
bool UGrottoRuntimeSubsystem::ReadLocalSave(const FString& Slot, FString& StateJson) const
{
    const FString File = LocalPath(Slot); StateJson.Reset();
    return !File.IsEmpty() && IFileManager::Get().FileSize(*File) <= 256 * 1024
        && FFileHelper::LoadFileToString(StateJson, *File) && JsonState(StateJson);
}
