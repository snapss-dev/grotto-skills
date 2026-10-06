using UnrealBuildTool;

public class GrottoRuntime : ModuleRules
{
    public GrottoRuntime(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
        PublicDependencyModuleNames.AddRange(new[] { "Core", "CoreUObject", "Engine" });
        PrivateDependencyModuleNames.AddRange(new[] { "Json" });
        if (Target.Platform == UnrealTargetPlatform.Win64) PublicSystemLibraries.Add("winhttp.lib");
    }
}
