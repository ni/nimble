﻿using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance;

public class WaferMapTests : AcceptanceTestsBase
{
    private const int RenderingTimeout = 200;
    public WaferMapTests(PlaywrightFixture playwrightFixture, BlazorServerWebHostFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    { }

    [Fact]
    public async Task WaferMap_WithDiesAndColorScale_RendersColorsAsync()
    {
        await using var pageWrapper = await NewPageForRouteAsync("WaferMapRenderTest");
        var page = pageWrapper.Page;
        var canvas = page.Locator(".main-wafer");

        await Assertions.Expect(canvas).ToBeVisibleAsync();
        await Task.Delay(RenderingTimeout);
        var color = await page.EvaluateAsync<string>(
            @"document.getElementsByTagName('nimble-wafer-map')[0].canvas.getContext('2d').getImageData(249, 249, 1, 1).data.toString()");

        Assert.Equal(@"85,85,0,255", color);
    }

    [Fact]
    public async Task WaferMap_WithGridDimensions_IsValidAsync()
    {
        await using var pageWrapper = await NewPageForRouteAsync("WaferMapRenderTest");
        var page = pageWrapper.Page;
        var canvas = page.Locator(".main-wafer");
        var validButton = page.Locator("nimble-button");
        var textField = page.Locator("nimble-text-field");

        await Assertions.Expect(canvas).ToBeVisibleAsync();
        await Task.Delay(RenderingTimeout);
        await validButton.ClickAsync();

        await Assertions.Expect(textField).ToHaveAttributeAsync("current-value", "False");
    }

    [Fact]
    public async Task WaferMap_WithHoverEvent_TriggersDieChangeEventAsync()
    {
        await using var pageWrapper = await NewPageForRouteAsync("WaferMapRenderTest");
        var page = pageWrapper.Page;
        var canvas = page.Locator(".main-wafer");
        var textField = page.Locator("nimble-text-field");

        await Assertions.Expect(canvas).ToBeVisibleAsync();
        await Task.Delay(RenderingTimeout);
        await canvas.HoverAsync();

        await Assertions.Expect(textField).ToHaveAttributeAsync("current-value", "4");
    }
}
