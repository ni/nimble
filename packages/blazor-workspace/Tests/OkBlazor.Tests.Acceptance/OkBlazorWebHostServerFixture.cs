using BlazorWorkspace.Testing.Acceptance;
using IStartup = BlazorWorkspace.Testing.Acceptance.IStartup;

namespace OkBlazor.Tests.Acceptance;

/// <summary>
/// Test fixture which starts up a Blazor Server web server
/// </summary>
public class OkBlazorWebHostServerFixture : WebHostServerFixture
{
    // In order for components in this assembly to be discoverable, the Startup instance must be created in this assembly.
    protected override IStartup StartupFactory(WebHostBuilderContext context)
    {
        return new Startup<App>();
    }
}
