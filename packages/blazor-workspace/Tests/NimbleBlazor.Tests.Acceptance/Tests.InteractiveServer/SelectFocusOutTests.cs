using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public class SelectFocusOutTests : NimbleInteractiveAcceptanceTestsBase
{
    public SelectFocusOutTests(NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task SelectFocusOut_FiresCallbackAndAllowsSelectToCloseAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("InteractiveServer/SelectFocusOut"))
        {
            var page = pageWrapper.Page;
            var select = page.Locator("#select");
            var focusOutCount = page.Locator("#focusOutCount");
            var focusTarget = page.Locator("#focusTarget");

            await Expect(select).ToBeVisibleAsync();

            await select.ClickAsync();
            await Expect(select).ToHaveAttributeAsync("open", string.Empty);

            await focusTarget.ClickAsync();

            await Expect(focusOutCount).ToHaveAttributeAsync("current-value", "1");
            await Expect(select).Not.ToHaveAttributeAsync("open", string.Empty);
        }
    }
}
