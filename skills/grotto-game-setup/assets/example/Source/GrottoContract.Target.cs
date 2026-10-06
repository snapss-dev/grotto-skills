using UnrealBuildTool;
public class GrottoContractTarget : TargetRules
{
    public GrottoContractTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Game;
        DefaultBuildSettings = BuildSettingsVersion.Latest;
        IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_8;
        ExtraModuleNames.Add("GrottoContract");
    }
}
