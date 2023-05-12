using Microsoft.Playwright;
using Xunit;
using PlaywrightProgram = Microsoft.Playwright.Program;

namespace NimbleBlazor.Tests.Acceptance;

/// <summary>
/// Fixture to handle Playwright initialization for acceptance tests.
/// </summary>
public class PlaywrightFixture : IAsyncLifetime
{
    private IBrowser? _browser;
    private IPlaywright? _playwright;
    public IBrowserContext? BrowserContext { get; private set; }

    public async Task InitializeAsync()
    {
        await InstallChromiumAsync();
        _playwright = await Playwright.CreateAsync();
        _browser = await _playwright.Chromium.LaunchAsync(
            new BrowserTypeLaunchOptions()
            {
#if DEBUG
                Headless = false,
                SlowMo = 1000
#endif
            });
        BrowserContext = await _browser.NewContextAsync(new BrowserNewContextOptions { IgnoreHTTPSErrors = true });
#if DEBUG
        BrowserContext.SetDefaultTimeout(30000);
#endif
    }

    public async Task DisposeAsync()
    {
        if (BrowserContext != null)
        {
            await BrowserContext.DisposeAsync();
        }
        if (_browser != null)
        {
            await _browser.DisposeAsync();
        }
        _playwright?.Dispose();
    }

    private Task InstallChromiumAsync()
    {
        return Task.FromResult(PlaywrightProgram.Main(new string[] { "install", "chromium" }));
    }
}