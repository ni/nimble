using BlazorWorkspace.Testing.Acceptance;
using Microsoft.Playwright;
using Xunit;

namespace SprightBlazor.Tests.Acceptance;

public class RectangleTests : SprightAcceptanceTestsBase
{
    public RectangleTests(PlaywrightFixture playwrightFixture, SprightBlazorWebHostServerFixture blazorServerClassFixture)
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
