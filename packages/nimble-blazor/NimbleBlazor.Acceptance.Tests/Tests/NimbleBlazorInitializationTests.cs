using Xunit;

namespace NimbleBlazor.Tests.Acceptance
{
    public class NimbleBlazorInitializationTests : AcceptanceTestsBase
    {
        public NimbleBlazorInitializationTests(PlaywrightFixture playwrightFixture, BlazorServerWebHostFixture blazorServerClassFixture)
            : base(playwrightFixture, blazorServerClassFixture)
        {
        }

        [Fact]
        public async Task PageWithNimbleBlazor_NimbleBlazorInitializedAsync()
        {
            await using (var pageWrapper = await NewPageForRouteAsync("NimbleBlazorInitialization"))
            {
                var page = pageWrapper.Page;
                var nimbleBlazorInitializedHandle = await page.WaitForFunctionAsync("window.NimbleBlazor && window.NimbleBlazor.calledAfterStarted === true");
                var nimbleBlazorInitialized = await nimbleBlazorInitializedHandle.JsonValueAsync<bool>();
                Assert.True(nimbleBlazorInitialized);
            }
        }
    }
}
