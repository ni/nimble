using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveWebAssembly;

public class DialogTests : NimbleInteractiveAcceptanceTestsBase
{
    public DialogTests(NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task Dialog_CanOpenAndCloseAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("InteractiveWebAssembly/DialogOpenAndClose"))
        {
            var page = pageWrapper.Page;
            var openButton = page.Locator("nimble-button", new PageLocatorOptions() { HasText = "Open" });
            await openButton.ClickAsync();

            var dialog = page.Locator("nimble-dialog");
            var innerDialog = dialog.GetByRole(AriaRole.Dialog);
            await Expect(innerDialog).ToBeVisibleAsync();
            await Expect(dialog).ToContainTextAsync("Example Dialog");

            var closeButton = page.Locator("nimble-button", new PageLocatorOptions() { HasText = "Close" });
            await closeButton.ClickAsync();

            await Expect(innerDialog).Not.ToBeVisibleAsync();

            var textField = page.Locator("nimble-text-field");
            await Expect(textField).ToHaveAttributeAsync("current-value", "Custom Close Reason");
        }
    }
}
