using Microsoft.Playwright;
using Xunit;

namespace SprightBlazor.Tests.Acceptance;

public class RectangleTests : AcceptanceTestsBase
{
    public RectangleTests(PlaywrightFixture playwrightFixture, BlazorServerWebHostFixture blazorServerClassFixture)
        : base(playwrightFixture, blazorServerClassFixture)
    {
    }

    [Fact]
    public async Task Rectangle_ExampleAcceptanceTestAsync()
    {
        await using (var pageWrapper = await NewPageForRouteAsync("Rectangle"))
        {
            var page = pageWrapper.Page;
            var rectangle = page.Locator("spright-rectangle", new PageLocatorOptions() { HasText = "Hello, world." });

            await rectangle.ClickAsync();

            // assert something
        }
    }
}
