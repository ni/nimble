using BlazorWorkspace.Testing.Acceptance;
using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public class TableColumnNumberTextTests : NimbleAcceptanceTestsBase
{
    public TableColumnNumberTextTests(PlaywrightFixture playwrightFixture, NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task TableColumnNumberText_BytesUnitAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("InteractiveServer/TableColumnNumberText"))
        {
            var page = pageWrapper.Page;
            var table = page.Locator("nimble-table");
            await Assertions.Expect(table).ToBeVisibleAsync();

            var unitByte = table.Locator("nimble-unit-byte");
            await Assertions.Expect(unitByte).ToHaveCountAsync(1);
            await Assertions.Expect(unitByte).ToHaveAttributeAsync("binary", string.Empty);
        }
    }
}
