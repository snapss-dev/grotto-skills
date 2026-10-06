using UnrealBuildTool;
public class GrottoContract : ModuleRules
{
    public GrottoContract(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
        PublicDependencyModuleNames.AddRange(new[] { "Core", "CoreUObject", "Engine", "GrottoRuntime" });
    }
}
