using Microsoft.Playwright;
using Xunit;

namespace BlazorWorkspace.Testing.Acceptance;

[Collection(nameof(PlaywrightFixture))]
public abstract class AcceptanceTestsBase
{
    private readonly PlaywrightFixture _playwrightFixture;

    protected abstract Uri ServerAddress { get; }
    protected abstract string ComponentLibraryInitializationTestJavaScript { get; }

    protected AcceptanceTestsBase(PlaywrightFixture playwrightFixture)
    {
        _playwrightFixture = playwrightFixture;
    }

    protected async Task<AsyncDisposablePage> NewPageForRouteAsync(string route)
    {
        var browserContext = _playwrightFixture.BrowserContext!;
        var page = await browserContext.NewPageAsync();
        await browserContext.Tracing.StartAsync(new()
        {
            Screenshots = true,
            Snapshots = true
        });
        await NavigateToPageAsync(page, route);
        await WaitForComponentsInitializationAsync(page);
        return new AsyncDisposablePage(page, browserContext);
    }

    private async Task NavigateToPageAsync(IPage page, string route)
    {
        var address = new Uri(ServerAddress!, route).AbsoluteUri;
        await page.GotoAsync(address);
    }

    private async Task WaitForComponentsInitializationAsync(IPage page)
    {
        await page.WaitForFunctionAsync(ComponentLibraryInitializationTestJavaScript);
    }

    protected sealed class AsyncDisposablePage : IAsyncDisposable
    {
        public IPage Page { get; private set; }
        private readonly IBrowserContext _browserContext;
        private readonly string _traceName = string.Empty;

        public AsyncDisposablePage(IPage page, IBrowserContext context)
        {
            Page = page;
            _browserContext = context;
            // _traceName = Uri.EscapeDataString(route.Replace("/", "_")) + "_" + pageCount;
            _traceName = "failing-test";
        }

        public async ValueTask DisposeAsync()
        {
            await _browserContext.Tracing.StopAsync(new()
            {
                Path = _traceName + ".zip"
            });
            await Page.CloseAsync();
        }
    }
}
