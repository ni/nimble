using BlazorWorkspace.Testing.Acceptance;
using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance.StaticSSR;

public class TextFieldTests : NimbleAcceptanceTestsBase
{
    public TextFieldTests(PlaywrightFixture playwrightFixture, NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task TextField_CanRenderAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("StaticSSR/TextFieldRenderTest"))
        {
            var page = pageWrapper.Page;
            var textField = page.Locator("nimble-text-field", new PageLocatorOptions() { HasText = "Label Text" });
            await Assertions.Expect(textField).ToBeVisibleAsync();
            await Assertions.Expect(textField).ToHaveAttributeAsync("current-value", "Value Text");
        }
    }
}
