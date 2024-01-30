using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance
{
    public class WaferMapTests : AcceptanceTestsBase
    {
        public WaferMapTests(PlaywrightFixture playwrightFixture, BlazorServerWebHostFixture blazorServerClassFixture)
            : base(playwrightFixture, blazorServerClassFixture)
        {
        }

        [Fact]
        public async Task WaferMap_RendersCircleAsync()
        {
            await using var pageWrapper = await NewPageForRouteAsync("WaferMapRendersCircle");
            var page = pageWrapper.Page;
            var bytes = await page.Locator("canvas").ScreenshotAsync();
            Assert.Equal(bytes, await File.ReadAllBytesAsync("../../../WaferMapRendersCircle.png"));
        }
    }
}
