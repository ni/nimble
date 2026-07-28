using Microsoft.Playwright;
using Microsoft.Playwright.Xunit.v3;

namespace BlazorWorkspace.Testing.Acceptance;

public abstract class AcceptanceTestsBase : PageTest
{
    protected abstract Uri ServerAddress { get; }

    /// <summary>
    /// Optional JavaScript code to test if the component library is ready for interactions
    /// Can be left as default for static server-side rendering tests.
    /// </summary>
    protected virtual string ComponentLibraryInitializationTestJavaScript => string.Empty;

    protected async Task<AsyncDisposablePage> NewPageForRouteAsync(string route)
    {
        await NavigateToPageAsync(Page, route);
        await WaitForComponentsInitializationAsync(Page);
        return new AsyncDisposablePage(Page);
    }

    private async Task NavigateToPageAsync(IPage page, string route)
    {
        var address = new Uri(ServerAddress, route).AbsoluteUri;
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
