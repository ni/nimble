using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

#nullable enable

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleThemeProvider"/>.
/// </summary>
public class NimbleThemeProviderTests : BunitTestBase
{
    [Fact]
    public void NimbleThemeProvider_Render_HasThemeProviderMarkup()
    {
        var themeProvider = Render<NimbleThemeProvider>();

        Assert.NotNull(themeProvider.Find("nimble-theme-provider"));
    }

    [Fact]
    public void NimbleThemeProvider_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleThemeProvider>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(Theme.Light, "light")]
    [InlineData(Theme.Dark, "dark")]
    [InlineData(Theme.Color, "color")]
    public void NimbleThemeProvider_ThemeIsSet(Theme value, string expectedAttribute)
    {
        var themeProvider = RenderNimbleThemeProvider(value);

        themeProvider.AssertAttribute("theme", expectedAttribute);
    }

    [Theory]
    [InlineData(Direction.Ltr, "ltr")]
    [InlineData(Direction.Rtl, "rtl")]
    public void NimbleThemeProvider_DirectionIsSet(Direction value, string expectedAttribute)
    {
        var themeProvider = RenderNimbleThemeProvider(value);

        themeProvider.AssertAttribute("direction", expectedAttribute);
    }

    [Fact]
    public void NimbleThemeProvider_ValidLangIsSetAsync()
    {
        var themeProvider = RenderNimbleThemeProvider("de-DE");

        themeProvider.AssertAttribute("lang", "de-DE");
    }

    [Fact]
    public void NimbleThemeProvider_NullLangIsSetAsync()
    {
        var themeProvider = RenderNimbleThemeProvider(null);

        themeProvider.AssertAttribute("lang", null);
    }

    private IRenderedComponent<NimbleThemeProvider> RenderNimbleThemeProvider(Theme theme)
    {
        return Render<NimbleThemeProvider>(p => p.Add(x => x.Theme, theme));
    }

    private IRenderedComponent<NimbleThemeProvider> RenderNimbleThemeProvider(Direction direction)
    {
        return Render<NimbleThemeProvider>(p => p.Add(x => x.Direction, direction));
    }

    private IRenderedComponent<NimbleThemeProvider> RenderNimbleThemeProvider(string? lang)
    {
        return Render<NimbleThemeProvider>(p => p.Add(x => x.Lang, lang));
    }
}
