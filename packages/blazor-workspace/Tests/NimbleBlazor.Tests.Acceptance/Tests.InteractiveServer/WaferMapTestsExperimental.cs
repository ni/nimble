﻿using BlazorWorkspace.Testing.Acceptance;
using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public class WaferMapTestsExperimental : NimbleInteractiveAcceptanceTestsBase
{
    public WaferMapTestsExperimental(PlaywrightFixture playwrightFixture, NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    { }

    private async Task WaitForWaferMapRenderCompleteAsync(IPage page)
    {
        await Assertions.Expect(page.Locator(".render-text-field")).ToHaveAttributeAsync("current-value", "RenderComplete");
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
        await Assertions.Expect(wafer).ToBeVisibleAsync();
        await validButton.ClickAsync();

        await Assertions.Expect(textField).ToHaveAttributeAsync("current-value", "False");
    }

    [Fact]
    public async Task WaferMap_WithHoverEvent_TriggersDieChangeEventAsync()
    {
        await using var pageWrapper = await NewPageForRouteAsync("InteractiveServer/WaferMapRenderTestExperimental");
        var page = pageWrapper.Page;
        var wafer = page.Locator("nimble-wafer-map");
        var textField = page.Locator(".test-text-field");

        await WaitForWaferMapRenderCompleteAsync(page);
        await Assertions.Expect(wafer).ToBeVisibleAsync();
        await wafer.HoverAsync();

        await Assertions.Expect(textField).ToHaveAttributeAsync("current-value", "4");
    }
}
