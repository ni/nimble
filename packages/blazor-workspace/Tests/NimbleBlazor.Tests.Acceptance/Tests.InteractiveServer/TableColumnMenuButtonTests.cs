using BlazorWorkspace.Testing.Acceptance;
using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public class TableColumnMenuButtonTests : NimbleAcceptanceTestsBase
{
    public TableColumnMenuButtonTests(PlaywrightFixture playwrightFixture, NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task TableColumnNumberText_ToggleEventsAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("InteractiveServer/TableColumnMenuButton"))
        {
            var page = pageWrapper.Page;
            var table = page.Locator("nimble-table");
            await Assertions.Expect(table).ToBeVisibleAsync();

            var beforeToggleOldState = page.Locator("#beforeToggleOldState");
            var beforeToggleNewState = page.Locator("#beforeToggleNewState");
            var beforeToggleRecord = page.Locator("#beforeToggleRecord");
            var toggleOldState = page.Locator("#toggleOldState");
            var toggleNewState = page.Locator("#toggleNewState");
            var toggleRecord = page.Locator("#toggleRecord");

            var menuButton = table.Locator("nimble-menu-button");
            // Open the menu button
            await menuButton.ClickAsync();

            await Assertions.Expect(beforeToggleOldState).ToHaveAttributeAsync("current-value", "false");
            await Assertions.Expect(beforeToggleNewState).ToHaveAttributeAsync("current-value", "true");
            await Assertions.Expect(beforeToggleRecord).ToHaveAttributeAsync("current-value", "1");
            await Assertions.Expect(toggleOldState).ToHaveAttributeAsync("current-value", "false");
            await Assertions.Expect(toggleNewState).ToHaveAttributeAsync("current-value", "true");
            await Assertions.Expect(toggleRecord).ToHaveAttributeAsync("current-value", "1");

            // Close the menu button
            await menuButton.ClickAsync();

            await Assertions.Expect(beforeToggleOldState).ToHaveAttributeAsync("current-value", "true");
            await Assertions.Expect(beforeToggleNewState).ToHaveAttributeAsync("current-value", "false");
            await Assertions.Expect(beforeToggleRecord).ToHaveAttributeAsync("current-value", "1");
            await Assertions.Expect(toggleOldState).ToHaveAttributeAsync("current-value", "true");
            await Assertions.Expect(toggleNewState).ToHaveAttributeAsync("current-value", "false");
            await Assertions.Expect(toggleRecord).ToHaveAttributeAsync("current-value", "1");
        }
    }
}
