using BlazorWorkspace.Testing.Acceptance;
using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public class NumberFieldBindingTests : NimbleInteractiveAcceptanceTestsBase
{
    public NumberFieldBindingTests(PlaywrightFixture playwrightFixture, NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task NumberField_TwoWayBindingsDontBreakAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("InteractiveServer/NumberFieldBindings"))
        {
            var page = pageWrapper.Page;
            var numberField1 = page.Locator("#number1");
            var numberField1IncButton = numberField1.Locator("nimble-button", new LocatorLocatorOptions() { HasText = "Increment" });
            var numberField2 = page.Locator("#number2");
            var numberField2IncButton = numberField2.Locator("nimble-button", new LocatorLocatorOptions() { HasText = "Increment" });

            await numberField1IncButton.ClickAsync();
            await Assertions.Expect(numberField2).ToHaveAttributeAsync("current-value", "0.5");
            await numberField2IncButton.ClickAsync();
            await Assertions.Expect(numberField1).ToHaveAttributeAsync("current-value", "3"); // incrementing numberField2 to 1.5 should result in 3 for numberField1
        }
    }
}
