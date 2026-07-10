using BlazorWorkspace.Testing.Unit;
using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleToolbar"/>
/// </summary>
public class NimbleToolbarTests : BunitTestBase
{
    [Fact]
    public void NimbleToolbarRendered_HasToolbarMarkup()
    {
        var toolbar = Render<NimbleToolbar>();

        Assert.NotNull(toolbar.Find("nimble-toolbar"));
    }

    [Fact]
    public void NimbleToolbar_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleToolbar>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleToolbarWithChildContent_HasChildMarkup()
    {
        var toolbar = RenderToolbarWithContent<NimbleButton>();

        Assert.NotNull(toolbar.Find("nimble-button"));
    }

    private IRenderedComponent<NimbleToolbar> RenderToolbarWithContent<TContent>()
        where TContent : IComponent
    {
        return Render<NimbleToolbar>(parameters => parameters.AddChildContent<TContent>());
    }
}
