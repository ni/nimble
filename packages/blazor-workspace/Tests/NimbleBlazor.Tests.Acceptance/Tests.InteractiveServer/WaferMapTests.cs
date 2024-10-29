using BlazorWorkspace.Testing.Acceptance;
using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public class WaferMapTests : NimbleInteractiveAcceptanceTestsBase
{
    public WaferMapTests(PlaywrightFixture playwrightFixture, NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    { }

    private async Task WaitForWaferMapRenderCompleteAsync(IPage page)
    {
        await Assertions.Expect(page.Locator(".render-text-field")).ToHaveAttributeAsync("current-value", "RenderComplete");
    }

    [Fact]
    public async Task WaferMap_WithDiesAndColorScale_RendersColorsAsync()
    {
        await using var pageWrapper = await NewPageForRouteAsync("InteractiveServer/WaferMapRenderTest");
        var page = pageWrapper.Page;
        var wafer = page.Locator("nimble-wafer-map");
        var canvas = page.Locator(".main-wafer");

        await WaitForWaferMapRenderCompleteAsync(page);
        await Assertions.Expect(wafer).ToBeVisibleAsync();
        await Assertions.Expect(canvas).ToBeVisibleAsync();
        var color = await page.EvaluateAsync<string>(
            @"document.getElementsByTagName('nimble-wafer-map')[0].canvas.getContext('2d').getImageData(249, 249, 1, 1).data.toString()");

        Assert.Equal(@"85,85,0,255", color);
    }

    [Fact]
    public async Task WaferMap_WithGridDimensions_IsValidAsync()
    {
        await using var pageWrapper = await NewPageForRouteAsync("InteractiveServer/WaferMapRenderTest");
        var page = pageWrapper.Page;
        var wafer = page.Locator("nimble-wafer-map");
        var validButton = page.Locator("nimble-button");
        var textField = page.Locator(".test-text-field");

        await WaitForWaferMapRenderCompleteAsync(page);
        await Assertions.Expect(wafer).ToBeVisibleAsync();
        await validButton.ClickAsync();

        await Assertions.Expect(textField).ToHaveAttributeAsync("current-value", "False");
    }

    [Fact]
    public async Task WaferMap_WithHoverEvent_TriggersDieChangeEventAsync()
    {
        await using var pageWrapper = await NewPageForRouteAsync("InteractiveServer/WaferMapRenderTest");
        var page = pageWrapper.Page;
        var wafer = page.Locator("nimble-wafer-map");
        var textField = page.Locator(".test-text-field");

        await WaitForWaferMapRenderCompleteAsync(page);
        await Assertions.Expect(wafer).ToBeVisibleAsync();
        await wafer.HoverAsync();

        await Assertions.Expect(textField).ToHaveAttributeAsync("current-value", "4");
    }
}
