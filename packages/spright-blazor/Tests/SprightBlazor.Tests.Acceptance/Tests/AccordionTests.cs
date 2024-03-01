using Microsoft.Playwright;
using Xunit;

namespace SprightBlazor.Tests.Acceptance
{
    public class AccordionTests : AcceptanceTestsBase
    {
        public AccordionTests(PlaywrightFixture playwrightFixture, BlazorServerWebHostFixture blazorServerClassFixture)
            : base(playwrightFixture, blazorServerClassFixture)
        {
        }

        [Fact]
        public async Task Accordion_DoesSomethingAsync()
        {
            await using (var pageWrapper = await NewPageForRouteAsync("AccordionClick"))
            {
                var page = pageWrapper.Page;
                var accordionElement = page.Locator("spright-accordion", new PageLocatorOptions() { HasText = "Foo" });
                await accordionElement.ClickAsync();
            }
        }
    }
}
