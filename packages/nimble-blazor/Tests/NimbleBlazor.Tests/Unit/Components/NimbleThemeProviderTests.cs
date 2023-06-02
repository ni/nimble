using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleButton"/>.
/// </summary>
public class NimbleThemeProviderTests
{
    [Fact]
    public void NimbleThemeProvider_Render_HasThemeProviderMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-theme-provider";

        var themeProvider = context.RenderComponent<NimbleThemeProvider>();

        Assert.Contains(expectedMarkup, themeProvider.Markup);
    }

    [Fact]
    public void NimbleThemeProvider_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleThemeProvider>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(Theme.Light, "light")]
    [InlineData(Theme.Dark, "dark")]
    [InlineData(Theme.Color, "color")]
    public void NimbleThemeProvider_ThemeIsSet(Theme value, string expectedAttribute)
    {
        var themeProvider = RenderNimbleThemeProvider(value);

        Assert.Contains(expectedAttribute, themeProvider.Markup);
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
