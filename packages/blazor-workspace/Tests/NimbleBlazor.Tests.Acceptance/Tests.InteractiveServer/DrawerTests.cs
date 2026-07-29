using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public class DrawerTests : NimbleInteractiveAcceptanceTestsBase
{
    public DrawerTests(NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task Drawer_CanOpenAndCloseAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("InteractiveServer/DrawerOpenAndClose"))
        {
            var page = pageWrapper.Page;
            var openButton = page.Locator("nimble-button", new PageLocatorOptions() { HasText = "Open" });
            await openButton.ClickAsync();

            var drawer = page.Locator("nimble-drawer");
            var drawerInnerDialog = drawer.GetByRole(AriaRole.Dialog);
            await Expect(drawerInnerDialog).ToBeVisibleAsync();
            await Expect(drawer).ToContainTextAsync("Example Drawer");

            var closeButton = page.Locator("nimble-button", new PageLocatorOptions() { HasText = "Close" });
            await closeButton.ClickAsync();

            await Expect(drawerInnerDialog).Not.ToBeVisibleAsync();

            var textField = page.Locator("nimble-text-field");
            await Expect(textField).ToHaveAttributeAsync("current-value", "Custom Close Reason");
        }
    }
}
