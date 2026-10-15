using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public class TableColumnMenuButtonTests : NimbleInteractiveAcceptanceTestsBase
{
    public TableColumnMenuButtonTests(NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task TableColumnNumberText_ToggleEventsAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("InteractiveServer/TableColumnMenuButton"))
        {
            var page = pageWrapper.Page;
            var table = page.Locator("nimble-table");
            await Expect(table).ToBeVisibleAsync();

            var beforeToggleOldState = page.Locator("#beforeToggleOldState");
            var beforeToggleNewState = page.Locator("#beforeToggleNewState");
            var beforeToggleRecord = page.Locator("#beforeToggleRecord");
            var toggleOldState = page.Locator("#toggleOldState");
            var toggleNewState = page.Locator("#toggleNewState");
            var toggleRecord = page.Locator("#toggleRecord");

            var menuButton = table.Locator("nimble-menu-button");
            // Open the menu button
            await menuButton.ClickAsync();

            await Expect(beforeToggleOldState).ToHaveAttributeAsync("current-value", "false");
            await Expect(beforeToggleNewState).ToHaveAttributeAsync("current-value", "true");
            await Expect(beforeToggleRecord).ToHaveAttributeAsync("current-value", "1");
            await Expect(toggleOldState).ToHaveAttributeAsync("current-value", "false");
            await Expect(toggleNewState).ToHaveAttributeAsync("current-value", "true");
            await Expect(toggleRecord).ToHaveAttributeAsync("current-value", "1");

            // Close the menu button
            await menuButton.ClickAsync();

            await Expect(beforeToggleOldState).ToHaveAttributeAsync("current-value", "true");
            await Expect(beforeToggleNewState).ToHaveAttributeAsync("current-value", "false");
            await Expect(beforeToggleRecord).ToHaveAttributeAsync("current-value", "1");
            await Expect(toggleOldState).ToHaveAttributeAsync("current-value", "true");
            await Expect(toggleNewState).ToHaveAttributeAsync("current-value", "false");
            await Expect(toggleRecord).ToHaveAttributeAsync("current-value", "1");
        }
    }
}
