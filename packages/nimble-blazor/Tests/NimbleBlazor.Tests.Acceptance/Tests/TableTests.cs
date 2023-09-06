using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance
{
    public class TableTests : AcceptanceTestsBase
    {
        public TableTests(PlaywrightFixture playwrightFixture, BlazorServerWebHostFixture blazorServerClassFixture)
            : base(playwrightFixture, blazorServerClassFixture)
        {
        }

        [Fact]
        public async Task Table_RendersBoundDataAsync()
        {
            await using (var pageWrapper = await NewPageForRouteAsync("TableBindToData"))
            {
                var page = pageWrapper.Page;
                var table = page.Locator("nimble-table");
                await Assertions.Expect(table).ToBeVisibleAsync();

                var rows = table.Locator("nimble-table-row");
                await Assertions.Expect(rows).ToHaveCountAsync(5);
                await Assertions.Expect(rows).ToContainTextAsync(new string[] { "A0", "A1", "A2", "A3", "A4" });
            }
        }
    }
}
