using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleToolbar"/>
/// </summary>
public class NimbleToolbarTests
{
    [Fact]
    public void NimbleToolbarRendered_HasToolbarMarkup()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-toolbar";
        var toolbar = context.Render<NimbleToolbar>();

        Assert.Contains(expectedMarkup, toolbar.Markup);
    }

    [Fact]
    public void NimbleToolbar_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<NimbleToolbar>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleToolbarWithChildContent_HasChildMarkup()
    {
        var toolbar = RenderToolbarWithContent<NimbleButton>();
        var expectedMarkup = "nimble-button";

        Assert.Contains(expectedMarkup, toolbar.Markup);
    }

    private IRenderedComponent<NimbleToolbar> RenderToolbarWithContent<TContent>()
        where TContent : IComponent
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.Render<NimbleToolbar>(parameters => parameters.AddChildContent<TContent>());
    }
}
