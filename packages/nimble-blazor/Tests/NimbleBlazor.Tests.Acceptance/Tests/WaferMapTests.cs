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
            await using (var pageWrapper = await NewPageForRouteAsync("WaferMapRendersCircle"))
            {
                var page = pageWrapper.Page;
                var waferMap = page.Locator("nimble-wafer-map");
                await Assertions.Expect(waferMap).ToBeVisibleAsync();
            }
        }
    }
}
