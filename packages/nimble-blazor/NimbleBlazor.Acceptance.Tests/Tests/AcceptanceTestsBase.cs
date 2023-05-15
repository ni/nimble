using Microsoft.Playwright;
using Xunit;

namespace NimbleBlazor.Tests.Acceptance
{
    [Collection(nameof(PlaywrightFixture))]
    public abstract class AcceptanceTestsBase : IClassFixture<BlazorServerWebHostFixture>
    {
        private PlaywrightFixture _playwrightFixture;
        private readonly BlazorServerWebHostFixture _blazorServerClassFixture;

        protected AcceptanceTestsBase(
            PlaywrightFixture playwrightFixture,
            BlazorServerWebHostFixture blazorServerClassFixture)
        {
            _playwrightFixture = playwrightFixture;
            _blazorServerClassFixture = blazorServerClassFixture;
        }

        private IBrowserContext BrowserContext
        {
            get
            {
                return _playwrightFixture.BrowserContext!;
            }
        }

        protected async Task<AsyncDisposablePage> NewPageForRouteAsync(string route)
        {
            var page = await BrowserContext.NewPageAsync();
            await NavigateToPageAsync(page, route);
            await WaitForNimbleBlazorInitializationAsync(page);
            return new AsyncDisposablePage(page);
        }

        private async Task NavigateToPageAsync(IPage page, string route)
        {
            var address = new Uri(_blazorServerClassFixture.ServerAddress!, route).AbsoluteUri;
            await page.GotoAsync(address);
        }

        private async Task WaitForNimbleBlazorInitializationAsync(IPage page)
        {
            await page.WaitForFunctionAsync("window.NimbleBlazor && window.NimbleBlazor.calledAfterStarted === true");
        }

        protected sealed class AsyncDisposablePage : IAsyncDisposable
        {
            public IPage Page { get; private set; }

            public AsyncDisposablePage(IPage page)
            {
                Page = page;
            }

            public async ValueTask DisposeAsync()
            {
                await Page.CloseAsync();
            }
        }
    }
}
