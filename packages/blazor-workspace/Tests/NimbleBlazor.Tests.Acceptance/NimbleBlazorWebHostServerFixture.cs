using BlazorWorkspace.Testing.Acceptance;
using IStartup = BlazorWorkspace.Testing.Acceptance.IStartup;

namespace NimbleBlazor.Tests.Acceptance;

/// <summary>
/// Test fixture which starts up a Blazor Server web server
/// </summary>
public class NimbleBlazorWebHostServerFixture : WebHostServerFixture
{
    // In order for components in this assembly to be discoverable, the Startup instance must be created in this assembly.
    protected override IStartup StartupFactory(WebHostBuilderContext context)
    {
        var result = new Startup<App>();
        result.AddAdditionalAssemblies(typeof(Client._Imports).Assembly);
        return result;
    }
}
