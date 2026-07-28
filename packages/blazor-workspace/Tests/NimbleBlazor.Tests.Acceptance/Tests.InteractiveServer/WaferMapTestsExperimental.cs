using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public class WaferMapTestsExperimental : NimbleInteractiveAcceptanceTestsBase
{
    public WaferMapTestsExperimental(NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(blazorServerClassFixture)
    { }

    private async Task WaitForWaferMapRenderCompleteAsync(IPage page)
    {
        await Expect(page.Locator(".render-text-field")).ToHaveAttributeAsync("current-value", "RenderComplete");
    }

    [Fact]
    public async Task WaferMap_WithGridDimensions_IsValidAsync()
    {
        await using var pageWrapper = await NewPageForRouteAsync("InteractiveServer/WaferMapRenderTestExperimental");
        var page = pageWrapper.Page;
        var wafer = page.Locator("nimble-wafer-map");
        var validButton = page.Locator("nimble-button");
        var textField = page.Locator(".test-text-field");

        await WaitForWaferMapRenderCompleteAsync(page);
        await Expect(wafer).ToBeVisibleAsync();
        await validButton.ClickAsync();

        await Expect(textField).ToHaveAttributeAsync("current-value", "False");
    }

    [Fact]
    public async Task WaferMap_WithHoverEvent_TriggersDieChangeEventAsync()
    {
        await using var pageWrapper = await NewPageForRouteAsync("InteractiveServer/WaferMapRenderTestExperimental");
        var page = pageWrapper.Page;
        var wafer = page.Locator("nimble-wafer-map");
        var textField = page.Locator(".test-text-field");

        await WaitForWaferMapRenderCompleteAsync(page);
        await Expect(wafer).ToBeVisibleAsync();
        await wafer.HoverAsync();

        await Expect(textField).ToHaveAttributeAsync("current-value", "4");
    }
}
