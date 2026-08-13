using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public class ThemeProviderTests : NimbleInteractiveAcceptanceTestsBase
{
    public ThemeProviderTests(NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task ThemeProvider_ValidityAndCheckValidityWorkAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("InteractiveServer/ThemeProvider"))
        {
            var page = pageWrapper.Page;
            var validButton = page.Locator("nimble-button", new PageLocatorOptions() { HasText = "Set Valid Lang" });
            var invalidButton = page.Locator("nimble-button", new PageLocatorOptions() { HasText = "Set Invalid Lang" });
            var isValidCheckbox = page.Locator("nimble-checkbox", new PageLocatorOptions() { HasText = "IsValid" });
            var langIsInvalidCheckbox = page.Locator("nimble-checkbox", new PageLocatorOptions() { HasText = "InvalidLang" });

            await invalidButton.ClickAsync();
            await Expect(isValidCheckbox).Not.ToBeCheckedAsync();
            await Expect(langIsInvalidCheckbox).ToBeCheckedAsync();

            await validButton.ClickAsync();
            await Expect(isValidCheckbox).ToBeCheckedAsync();
            await Expect(langIsInvalidCheckbox).Not.ToBeCheckedAsync();
        }
    }
}
