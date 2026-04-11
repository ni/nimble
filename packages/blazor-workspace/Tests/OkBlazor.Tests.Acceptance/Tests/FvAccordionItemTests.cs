using BlazorWorkspace.Testing.Acceptance;
using Microsoft.Playwright;
using Xunit;

namespace OkBlazor.Tests.Acceptance;

public class FvAccordionItemTests : OkInteractiveAcceptanceTestsBase
{
    public FvAccordionItemTests(PlaywrightFixture playwrightFixture, OkBlazorWebHostServerFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task FvAccordionItem_RendersAndTogglesExpandedAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("FvAccordionItem"))
        {
            var page = pageWrapper.Page;
            var accordionItem = page.Locator("ok-fv-accordion-item");

            Assert.Equal("Hello, world.", await accordionItem.GetAttributeAsync("header"));
            Assert.Equal("block", await accordionItem.GetAttributeAsync("appearance"));

            await accordionItem.Locator(".accordion-item-summary").ClickAsync();

            Assert.NotNull(await accordionItem.GetAttributeAsync("expanded"));
        }
    }
}