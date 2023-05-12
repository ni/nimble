using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance
{
    public class DialogTests : AcceptanceTestsBase
    {
        public DialogTests(PlaywrightFixture playwrightFixture, BlazorServerWebHostFixture blazorServerClassFixture)
            : base(playwrightFixture, blazorServerClassFixture)
        {
        }

        [Fact]
        public async Task Dialog_CanOpenAndCloseAsync()
        {
            await using (var pageWrapper = await NewPageForRouteAsync("DialogOpenAndClose"))
            {
                var page = pageWrapper.Page;
                var openButton = page.Locator("nimble-button", new PageLocatorOptions() { HasText = "Open" });
                await openButton.ClickAsync();

                var dialog = page.Locator("nimble-dialog");
                await Assertions.Expect(dialog.GetByRole(AriaRole.Dialog)).ToBeVisibleAsync();
                await Assertions.Expect(dialog).ToContainTextAsync("Example Dialog");

                var closeButton = page.Locator("nimble-button", new PageLocatorOptions() { HasText = "Close" });
                await closeButton.ClickAsync();

                await Assertions.Expect(dialog).Not.ToBeVisibleAsync();

                var textField = page.Locator("nimble-text-field");
                await Assertions.Expect(textField).ToHaveAttributeAsync("current-value", "Custom Close Reason");
            }
        }
    }
}
