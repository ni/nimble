using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance
{
    public class TableColumnEnumTextTests : AcceptanceTestsBase
    {
        public TableColumnEnumTextTests(PlaywrightFixture playwrightFixture, BlazorServerWebHostFixture blazorServerClassFixture)
            : base(playwrightFixture, blazorServerClassFixture)
        {
        }

        [Fact]
        public async Task TableColumnEnumText_IntKeyAsync()
        {
            await using (var pageWrapper = await NewPageForRouteAsync("TableColumnEnumTextIntKey"))
            {
                var page = pageWrapper.Page;
                var table = page.Locator("nimble-table");
                await Assertions.Expect(table).ToBeVisibleAsync();

                var rows = table.Locator("nimble-table-row");
                await Assertions.Expect(rows).ToHaveCountAsync(4);
                await Assertions.Expect(rows).ToContainTextAsync(new string[] { "foo", "bar", "baz", string.Empty });
            }
        }
    }
}
