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
            await using (var pageWrapper = await NewPageForRouteAsync("TableSetData"))
            {
                var page = pageWrapper.Page;
                var table = page.Locator("nimble-table");
                await Assertions.Expect(table).ToBeVisibleAsync();

                var rows = table.Locator("nimble-table-row");
                await Assertions.Expect(rows).ToHaveCountAsync(5);
                await Assertions.Expect(rows).ToContainTextAsync(new string[] { "A0", "A1", "A2", "A3", "A4" });
            }
        }

        [Theory]
        [InlineData(0, TableRecordDelayedHierarchyState.CanLoadChildren)]
        [InlineData(1, TableRecordDelayedHierarchyState.None)]
        [InlineData(2, TableRecordDelayedHierarchyState.LoadingChildren)]
        [InlineData(3, TableRecordDelayedHierarchyState.None)]
        public async Task Table_RendersHierarchyOptionsAsync(int rowIndex, TableRecordDelayedHierarchyState expectedHierarchyState)
        {
            await using (var pageWrapper = await NewPageForRouteAsync("TableSetRecordHierarchyOptionsTest"))
            {
                var page = pageWrapper.Page;
                var table = page.Locator("nimble-table");
                await Assertions.Expect(table).ToBeVisibleAsync();

                var rows = table.Locator("nimble-table-row");
                await Assertions.Expect(rows).ToHaveCountAsync(4);

                var row = rows.Nth(rowIndex);
                var rowExpandCollapseButton = row.Locator("nimble-button");
                var rowSpinner = row.Locator("nimble-spinner");

                if (expectedHierarchyState == TableRecordDelayedHierarchyState.CanLoadChildren)
                {
                    await Assertions.Expect(rowExpandCollapseButton).ToBeVisibleAsync();
                }
                else
                {
                    await Assertions.Expect(rowExpandCollapseButton).Not.ToBeVisibleAsync();
                }

                if (expectedHierarchyState == TableRecordDelayedHierarchyState.LoadingChildren)
                {
                    await Assertions.Expect(rowSpinner).ToBeVisibleAsync();
                }
                else
                {
                    await Assertions.Expect(rowSpinner).Not.ToBeVisibleAsync();
                }
            }
        }
    }
}
