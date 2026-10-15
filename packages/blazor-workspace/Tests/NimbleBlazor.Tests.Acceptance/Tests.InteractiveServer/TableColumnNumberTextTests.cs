using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public class TableColumnNumberTextTests : NimbleInteractiveAcceptanceTestsBase
{
    public TableColumnNumberTextTests(NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task TableColumnNumberText_BytesUnitAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("InteractiveServer/TableColumnNumberText"))
        {
            var page = pageWrapper.Page;
            var table = page.Locator("nimble-table");
            await Expect(table).ToBeVisibleAsync();

            var unitByte = table.Locator("nimble-unit-byte");
            await Expect(unitByte).ToHaveCountAsync(1);
            await Expect(unitByte).ToHaveAttributeAsync("binary", string.Empty);
        }
    }
}
