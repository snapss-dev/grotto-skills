using UnrealBuildTool;
public class GrottoContractEditorTarget : TargetRules
{
    public GrottoContractEditorTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Editor;
        DefaultBuildSettings = BuildSettingsVersion.Latest;
        IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_8;
        ExtraModuleNames.Add("GrottoContract");
    }
}
