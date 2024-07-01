using BlazorWorkspace.Testing.Acceptance;
using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance;

public class WaferMapTests : NimbleAcceptanceTestsBase
{
    public WaferMapTests(PlaywrightFixture playwrightFixture, NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    { }

    [Fact]
    public async Task WaferMap_WithGridDimensions_IsValidAsync()
    {
        await using var pageWrapper = await NewPageForRouteAsync("WaferMapRenderTest");
        var page = pageWrapper.Page;
        var canvas = page.Locator(".worker-wafer");
        var validButton = page.Locator("nimble-button");
        var renderTextField = page.Locator(".render-text-field");
        var textField = page.Locator(".test-text-field");

        await Assertions.Expect(canvas).ToBeVisibleAsync();
        await validButton.ClickAsync();

        await Assertions.Expect(textField).ToHaveAttributeAsync("current-value", "False");
    }

    [Fact]
    public async Task WaferMap_WithHoverEvent_TriggersDieChangeEventAsync()
    {
        await using var pageWrapper = await NewPageForRouteAsync("WaferMapRenderTest");
        var page = pageWrapper.Page;
        var canvas = page.Locator(".worker-wafer");
        var renderTextField = page.Locator(".render-text-field");
        var textField = page.Locator(".test-text-field");

        await Assertions.Expect(canvas).ToBeVisibleAsync();
        await canvas.HoverAsync();

        await Assertions.Expect(textField).ToHaveAttributeAsync("current-value", "4");
    }
}
