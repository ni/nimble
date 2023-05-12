using Microsoft.AspNetCore.Mvc.RazorPages;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance
{
    public class FrameworkTests : AcceptanceTestsBase
    {
        public FrameworkTests(PlaywrightFixture playwrightFixture, BlazorServerWebHostFixture blazorServerClassFixture)
            : base(playwrightFixture, blazorServerClassFixture)
        {
        }

        [Fact]
        public async Task PageWithNimbleBlazor_Loaded_NimbleBlazorInitializedAsync()
        {
            await using (var pageWrapper = await NewPageForRouteAsync("NimbleFramework"))
            {
                var page = pageWrapper.Page;
                var nimbleBlazorInitializedHandle = await page.WaitForFunctionAsync("window.NimbleBlazor && window.NimbleBlazor.calledAfterStarted === true");
                var nimbleBlazorInitialized = await nimbleBlazorInitializedHandle.JsonValueAsync<bool>();
                Assert.True(nimbleBlazorInitialized);
            }
        }
    }
}
