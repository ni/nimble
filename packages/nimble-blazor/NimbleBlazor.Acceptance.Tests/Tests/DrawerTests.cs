using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance
{
    public class DrawerTests : AcceptanceTestsBase
    {
        public DrawerTests(PlaywrightFixture playwrightFixture, BlazorServerWebHostFixture blazorServerClassFixture)
            : base(playwrightFixture, blazorServerClassFixture)
        {
        }

        [Fact]
        public async Task Drawer_CanOpenAndCloseAsync()
        {
            await using (var pageWrapper = await NewPageForRouteAsync("DrawerOpenAndClose"))
            {
                var page = pageWrapper.Page;
                var openButton = page.Locator("nimble-button", new PageLocatorOptions() { HasText = "Open" });
                await openButton.ClickAsync();

                var dialog = page.Locator("nimble-drawer");
                await Assertions.Expect(dialog).ToContainTextAsync("Example Drawer");

                var closeButton = page.Locator("nimble-button", new PageLocatorOptions() { HasText = "Close" });
                await closeButton.ClickAsync();

                await Assertions.Expect(dialog).Not.ToBeVisibleAsync();

                var textField = page.Locator("nimble-text-field");
                await Assertions.Expect(textField).ToHaveAttributeAsync("current-value", "Custom Close Reason");
            }
        }
    }
}
