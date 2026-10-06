#pragma once
#include "CoreMinimal.h"
#include "Engine/GameInstance.h"
#include "GrottoRuntimeSubsystem.h"
#include "GrottoContractInstance.generated.h"

UCLASS()
class UGrottoContractInstance : public UGameInstance
{
    GENERATED_BODY()
public:
    virtual void Init() override;
private:
    UPROPERTY() TObjectPtr<UGrottoRuntimeSubsystem> Runtime;
    FString Scenario;
    FString ExpectedPlayerId = TEXT("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    FString SaveSlot = TEXT("test");
    bool bFinished = false;
    UFUNCTION() void Changed(EGrottoSessionState State, FString Reason);
    UFUNCTION() void Response(FString RequestId, int32 StatusCode, FString Json);
    void Done(bool Passed);
};
