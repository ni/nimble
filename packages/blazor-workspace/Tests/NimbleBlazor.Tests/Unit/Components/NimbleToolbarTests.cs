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
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-toolbar";
        var toolbar = context.RenderComponent<NimbleToolbar>();

        Assert.Contains(expectedMarkup, toolbar.Markup);
    }

    [Fact]
    public void NimbleToolbar_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleToolbar>(ComponentParameter.CreateParameter("class", "foo")));
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
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleToolbar>(parameters => parameters.AddChildContent<TContent>());
    }
}
