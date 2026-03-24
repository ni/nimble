using BlazorWorkspace.Testing.Acceptance;
using Microsoft.Playwright;
using Xunit;

namespace OkBlazor.Tests.Acceptance;

public class ButtonTests : OkInteractiveAcceptanceTestsBase
{
    public ButtonTests(PlaywrightFixture playwrightFixture, OkBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task Button_ExampleAcceptanceTestAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("Button"))
        {
            var page = pageWrapper.Page;
            var button = page.Locator("ok-button", new PageLocatorOptions() { HasText = "Hello, world." });

            await button.ClickAsync();

            // assert something
        }
    }
}
