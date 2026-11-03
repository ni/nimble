using System.Text.RegularExpressions;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance.InteractiveServer;

public partial class NumberFieldClearValueTests : NimbleInteractiveAcceptanceTestsBase
{
    public NumberFieldClearValueTests(NimbleBlazorWebHostServerFixture blazorServerClassFixture)
        : base(blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task NumberField_ClearingValueUpdatesControlAndBoundValue()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("InteractiveServer/NumberFieldClearValue"))
        {
            var page = pageWrapper.Page;
            var numberField1 = page.Locator("#number1");
            var numberField2 = page.Locator("#number2");
            await Expect(numberField1).ToHaveAttributeAsync("current-value", "123");
            await Expect(numberField2).ToHaveAttributeAsync("current-value", "123");

            var number1Input = numberField1.Locator("input");
            await number1Input.ClearAsync();
            await number1Input.BlurAsync();

            await Expect(numberField1).Not.ToHaveAttributeAsync("current-value", AnyValueRegex());
            await Expect(numberField2).Not.ToHaveAttributeAsync("current-value", AnyValueRegex());
        }
    }

    [GeneratedRegex(".*")]
    private static partial Regex AnyValueRegex();
}
