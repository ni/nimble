using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance
{
    public class ButtonTests : AcceptanceTestsBase
    {
        public ButtonTests(PlaywrightFixture playwrightFixture, BlazorServerWebHostFixture blazorServerClassFixture)
            : base(playwrightFixture, blazorServerClassFixture)
        {
        }

        [Fact]
        public async Task Button_Click_ButtonIsFocusedAsync()
        {
            await using (var pageWrapper = await NewPageForRouteAsync("Button"))
            {
                var page = pageWrapper.Page;
                var button = page.Locator("nimble-button");
                await Assertions.Expect(button).ToBeVisibleAsync();

                await button.ClickAsync();

                await Assertions.Expect(button).ToBeFocusedAsync();
            }
        }
    }
}
