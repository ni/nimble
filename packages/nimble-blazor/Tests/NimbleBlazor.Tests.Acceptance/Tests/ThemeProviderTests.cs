using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance
{
    public class ThemeProviderTests : AcceptanceTestsBase
    {
        public ThemeProviderTests(PlaywrightFixture playwrightFixture, BlazorServerWebHostFixture blazorServerClassFixture)
            : base(playwrightFixture, blazorServerClassFixture)
        {
        }

        [Fact]
        public async Task ThemeProvider_ValidityAndCheckValidityWorkAsync()
        {
            await using (var pageWrapper = await NewPageForRouteAsync("ThemeProvider"))
            {
                var page = pageWrapper.Page;
                var validButton = page.Locator("nimble-button", new PageLocatorOptions() { HasText = "Set Valid Lang" });
                var invalidButton = page.Locator("nimble-button", new PageLocatorOptions() { HasText = "Set Invalid Lang" });
                var isValidCheckbox = page.Locator("nimble-checkbox", new PageLocatorOptions() { HasText = "IsValid" });
                var langIsInvalidCheckbox = page.Locator("nimble-checkbox", new PageLocatorOptions() { HasText = "InvalidLang" });

                await invalidButton.ClickAsync();
                await Assertions.Expect(isValidCheckbox).Not.ToBeCheckedAsync();
                await Assertions.Expect(langIsInvalidCheckbox).ToBeCheckedAsync();

                await validButton.ClickAsync();
                await Assertions.Expect(isValidCheckbox).ToBeCheckedAsync();
                await Assertions.Expect(langIsInvalidCheckbox).Not.ToBeCheckedAsync();
            }
        }
    }
}
