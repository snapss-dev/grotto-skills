#pragma once
#include "CoreMinimal.h"
#include "Subsystems/GameInstanceSubsystem.h"
#include "Tickable.h"
#include "GrottoRuntimeSubsystem.generated.h"

UENUM(BlueprintType)
enum class EGrottoSessionState : uint8 { Offline, Connecting, Authenticated, Ended };

USTRUCT(BlueprintType)
struct FGrottoPlayer
{
    GENERATED_BODY()
    UPROPERTY(BlueprintReadOnly, Category="Grotto") FString Id;
    UPROPERTY(BlueprintReadOnly, Category="Grotto") FString DisplayName;
    UPROPERTY(BlueprintReadOnly, Category="Grotto") FString Avatar;
};

DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FGrottoSessionChanged, EGrottoSessionState, State, FString, Reason);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_ThreeParams(FGrottoResponse, FString, RequestId, int32, StatusCode, FString, Json);

/** One immutable launcher identity per game process. No Privy login or wallet
 * signing API. Blueprint receives public player data and sanitized responses. */
UCLASS()
class GROTTORUNTIME_API UGrottoRuntimeSubsystem : public UGameInstanceSubsystem, public FTickableGameObject
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable, Category="Grotto") void InitializeGrotto(const FString& ExpectedGameId);
    UFUNCTION(BlueprintPure, Category="Grotto") EGrottoSessionState GetSessionState() const { return State; }
    UFUNCTION(BlueprintPure, Category="Grotto") FGrottoPlayer GetPlayer() const { return Player; }
    UFUNCTION(BlueprintCallable, Category="Grotto") void ReadSave(const FString& Slot, const FString& RequestId);
    UFUNCTION(BlueprintCallable, Category="Grotto") void WriteSave(const FString& Slot, int32 BaseVersion, const FString& StateJson, const FString& RequestId);
    UFUNCTION(BlueprintCallable, Category="Grotto") void DeleteSave(const FString& Slot, const FString& RequestId);
    UFUNCTION(BlueprintCallable, Category="Grotto") void SendEvent(const FString& Type, const FString& PayloadJson, const FString& RequestId);
    UFUNCTION(BlueprintCallable, Category="Grotto") void Heartbeat();
    UFUNCTION(BlueprintCallable, Category="Grotto") void EndSession();
    // Local progress is explicitly separate from cloud writes. There is no
    // automatic merge/upload, including when authenticated identity disappears.
    UFUNCTION(BlueprintCallable, Category="Grotto") bool WriteLocalSave(const FString& Slot, const FString& StateJson);
    UFUNCTION(BlueprintCallable, Category="Grotto") bool ReadLocalSave(const FString& Slot, FString& StateJson) const;
    UPROPERTY(BlueprintAssignable, Category="Grotto") FGrottoSessionChanged OnSessionChanged;
    UPROPERTY(BlueprintAssignable, Category="Grotto") FGrottoResponse OnResponse;

    virtual void Deinitialize() override;
    virtual void Tick(float DeltaTime) override;
    virtual bool IsTickable() const override { return !IsTemplate() && bInitialized && State != EGrottoSessionState::Ended; }
    virtual bool IsTickableWhenPaused() const override { return true; }
    virtual TStatId GetStatId() const override { RETURN_QUICK_DECLARE_CYCLE_STAT(UGrottoRuntimeSubsystem, STATGROUP_Tickables); }
private:
    EGrottoSessionState State = EGrottoSessionState::Offline;
    FGrottoPlayer Player;
    FString GameId, ApiBaseUrl, SessionToken, Frame;
    void* Pipe = nullptr;
    bool bInitialized = false;
    int32 Generation = 0, PendingRequests = 0;
    double BootDeadline = 0, NextHeartbeat = 0;
    FDateTime ExpiresAt;
    void Offline(const FString& Reason);
    void Exchange(const FString& Json);
    void Request(const FString& Verb, const FString& RelativePath, const FString& Body, const FString& RequestId);
    void Send(const FString& Verb, const FString& RelativePath, const FString& Body, const FString& Token,
        TFunction<void(int32, const FString&)> Complete);
    FString LocalPath(const FString& Slot) const;
};
