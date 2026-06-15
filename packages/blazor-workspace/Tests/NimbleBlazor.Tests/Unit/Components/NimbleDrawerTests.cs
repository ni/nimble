using BlazorWorkspace.Testing.Unit;
using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleDrawer"/>
/// </summary>
public class NimbleDrawerTests : BunitTestBase
{
    [Fact]
    public void NimbleDrawer_Rendered_HasDrawerMarkup()
    {
        var drawer = Render<NimbleDrawer<string>>();

        Assert.NotNull(drawer.Find("nimble-drawer"));
    }

    [Fact]
    public void NimbleDrawer_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleDrawer<string>>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleDrawer_WithChildContent_HasChildMarkup()
    {
        var drawer = RenderDrawerWithContent<NimbleButton>();

        Assert.NotNull(drawer.Find("nimble-button"));
    }

    private IRenderedComponent<NimbleDrawer<string>> RenderDrawerWithContent<TContent>()
        where TContent : IComponent
    {
        return Render<NimbleDrawer<string>>(parameters => parameters.AddChildContent<TContent>());
    }
}
