using Bunit;
using NimbleBlazor.Components;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleButton"/>.
/// </summary>
public class NimbleThemeProviderTests
{
    [Fact]
    public void NimbleThemeProvider_Render_HasButtonMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-theme-provider";

        var themeProvider = context.RenderComponent<NimbleThemeProvider>();

        Assert.Contains(expectedMarkup, themeProvider.Markup);
    }

    [Theory]
    [InlineData(Theme.Light, "light")]
    [InlineData(Theme.Dark, "dark")]
    [InlineData(Theme.Color, "color")]
    public void NimbleThemeProvider_ThemeIsSet(Theme value, string expectedAttribute)
    {
        var button = RenderNimbleThemeProvider(value);

        Assert.Contains(expectedAttribute, button.Markup);
    }

    [Theory]
    [InlineData(Direction.Ltr, "ltr")]
    [InlineData(Direction.Rtl, "rtl")]
    public void NimbleThemeProvider_DirectionIsSet(Direction value, string expectedAttribute)
    {
        var themeProvider = RenderNimbleThemeProvider(value);

        Assert.Contains(expectedAttribute, themeProvider.Markup);
    }

    private IRenderedComponent<NimbleThemeProvider> RenderNimbleThemeProvider(Theme theme)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleThemeProvider>(p => p.Add(x => x.Theme, theme));
    }

    private IRenderedComponent<NimbleThemeProvider> RenderNimbleThemeProvider(Direction direction)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleThemeProvider>(p => p.Add(x => x.Direction, direction));
    }
}
