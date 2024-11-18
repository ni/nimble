using Microsoft.Playwright;
using Xunit;

namespace BlazorWorkspace.Testing.Acceptance;

[Collection(nameof(PlaywrightFixture))]
public abstract class AcceptanceTestsBase
{
    private readonly PlaywrightFixture _playwrightFixture;

    protected abstract Uri ServerAddress { get; }

    /// <summary>
    /// Optional JavaScript code to test if the component library is ready for interactions
    /// Can be left as default for static server-side rendering tests.
    /// </summary>
    protected virtual string ComponentLibraryInitializationTestJavaScript => string.Empty;

    protected AcceptanceTestsBase(PlaywrightFixture playwrightFixture)
    {
        _playwrightFixture = playwrightFixture;
    }

    protected async Task<AsyncDisposablePage> NewPageForRouteAsync(string route)
    {
        var page = await _playwrightFixture.BrowserContext!.NewPageAsync();
        await NavigateToPageAsync(page, route);
        await WaitForComponentsInitializationAsync(page);
        return new AsyncDisposablePage(page);
    }

    private async Task NavigateToPageAsync(IPage page, string route)
    {
        var address = new Uri(ServerAddress!, route).AbsoluteUri;
        await page.GotoAsync(address);
    }

    private async Task WaitForComponentsInitializationAsync(IPage page)
    {
        if (!string.IsNullOrEmpty(ComponentLibraryInitializationTestJavaScript))
        {
            await page.WaitForFunctionAsync(ComponentLibraryInitializationTestJavaScript);
        }
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
