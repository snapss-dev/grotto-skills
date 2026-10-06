#include "GrottoContractInstance.h"
#include "Misc/CommandLine.h"
#include "Misc/Parse.h"
#include "Modules/ModuleManager.h"
#include "Containers/Ticker.h"
#include "Misc/ConfigCacheIni.h"
#include "Misc/FileHelper.h"
#include "Misc/Paths.h"
IMPLEMENT_PRIMARY_GAME_MODULE(FDefaultGameModuleImpl, GrottoContract, "GrottoContract");

void UGrottoContractInstance::Init()
{
    Super::Init(); Scenario = TEXT("authenticated");
    // Test expectations are public config, never credentials. Config also
    // permits Desktop's actual empty-argument launch path to run the fixture.
    GConfig->GetString(TEXT("GrottoContractFixture"), TEXT("Scenario"), Scenario, GGameIni);
    FString GameId = TEXT("native-test");
    GConfig->GetString(TEXT("GrottoContractFixture"), TEXT("GameId"), GameId, GGameIni);
    GConfig->GetString(TEXT("GrottoContractFixture"), TEXT("ExpectedPlayerId"), ExpectedPlayerId, GGameIni);
    GConfig->GetString(TEXT("GrottoContractFixture"), TEXT("SaveSlot"), SaveSlot, GGameIni);
    FParse::Value(FCommandLine::Get(), TEXT("GrottoFixtureScenario="), Scenario);
    Runtime = GetSubsystem<UGrottoRuntimeSubsystem>();
    Runtime->OnSessionChanged.AddDynamic(this, &UGrottoContractInstance::Changed);
    Runtime->OnResponse.AddDynamic(this, &UGrottoContractInstance::Response);
    Runtime->InitializeGrotto(GameId);
}
void UGrottoContractInstance::Changed(EGrottoSessionState State, FString Reason)
{
    if (State == EGrottoSessionState::Authenticated)
    {
        if (Runtime->GetPlayer().Id != ExpectedPlayerId) { Done(false); return; }
        if (Scenario == TEXT("disconnect")) { UE_LOG(LogTemp, Display, TEXT("GROTTO_AUTH_READY")); return; }
        Runtime->WriteSave(SaveSlot, 0, TEXT("{\"level\":1}"), TEXT("write"));
    }
    else if (State == EGrottoSessionState::Offline)
    {
        FString Local;
        Done(Scenario != TEXT("authenticated") && Runtime->GetPlayer().Id.IsEmpty()
            && Runtime->WriteLocalSave(TEXT("offline"), TEXT("{\"level\":2}"))
            && Runtime->ReadLocalSave(TEXT("offline"), Local) && Local.Contains(TEXT("2")));
    }
    else if (State == EGrottoSessionState::Ended)
        FTSTicker::GetCoreTicker().AddTicker(FTickerDelegate::CreateWeakLambda(this, [this](float) { Done(true); return false; }), 1.0f);
}
void UGrottoContractInstance::Response(FString RequestId, int32 StatusCode, FString Json)
{
    if (Json.Contains(TEXT("grs_")) || Json.Contains(TEXT("glt_"))) { Done(false); return; }
    if (RequestId == TEXT("write") && StatusCode == 200)
        Runtime->WriteSave(SaveSlot, 0, TEXT("{\"level\":2}"), TEXT("conflict"));
    else if (RequestId == TEXT("conflict") && StatusCode == 409 && Json.Contains(TEXT("serverVersion")))
        Runtime->ReadSave(SaveSlot, TEXT("read"));
    else if (RequestId == TEXT("read") && StatusCode == 200 && Json.Contains(TEXT("level")))
        Runtime->SendEvent(TEXT("started"), TEXT("{}"), TEXT("event"));
    else if (RequestId == TEXT("event") && StatusCode == 200) Runtime->EndSession();
    else Done(false);
}
void UGrottoContractInstance::Done(bool Passed)
{
    if (bFinished) return;
    bFinished = true;
    UE_LOG(LogTemp, Display, TEXT("GROTTO_CONTRACT_%s %s"), Passed ? TEXT("PASS") : TEXT("FAIL"), *Scenario);
    const FString Receipt = FString::Printf(TEXT("{\"scenario\":\"%s\",\"passed\":%s}"), *Scenario, Passed ? TEXT("true") : TEXT("false"));
    FFileHelper::SaveStringToFile(Receipt, *FPaths::Combine(FPaths::ProjectSavedDir(), TEXT("grotto-contract-receipt.json")));
    // A graceful UE main-loop shutdown can discard a requested nonzero code.
    // Fail this test process immediately after its public receipt is flushed.
    FPlatformMisc::RequestExitWithStatus(!Passed, Passed ? 0 : 1);
}
