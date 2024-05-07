using NimbleBlazor.Tests.Acceptance.Shared;

namespace SprightBlazor.Tests.Acceptance;

/// <summary>
/// Test fixture which starts up a Blazor Server web server
/// </summary>
public class SprightBlazorWebHostServerFixture : WebHostServerFixture
{
    // In order for components in this assembly to be discoverable, the Startup instance must be created in this assembly.
    protected override Startup StartupFactory(WebHostBuilderContext context)
    {
        return new Startup();
    }
}
