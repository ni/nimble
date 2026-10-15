using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public class TableColumnMappingTests : NimbleInteractiveAcceptanceTestsBase
{
    public TableColumnMappingTests(NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task TableColumnMapping_BoolKeyAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("InteractiveServer/TableColumnMappingBoolKey"))
        {
            var page = pageWrapper.Page;
            var table = page.Locator("nimble-table");
            await Expect(table).ToBeVisibleAsync();

            var icon = table.Locator("nimble-icon-check");
            await Expect(icon).ToHaveCountAsync(1);
            await Expect(icon).ToHaveAttributeAsync("severity", "success");
            var spinner = table.Locator("nimble-spinner");
            await Expect(spinner).ToHaveCountAsync(1);
        }
    }
}
