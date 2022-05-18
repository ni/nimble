using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleDrawer"/>
/// </summary>
public class NimbleDrawerTests
{
    [Fact]
    public void NimbleDrawerRendered_HasDrawerMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-drawer";
        var drawer = context.RenderComponent<NimbleDrawer>();

        Assert.Contains(expectedMarkup, drawer.Markup);
    }

    [Fact]
    public void NimbleDrawerWithChildContent_HasChildMarkup()
    {
        var drawer = RenderDrawerWithContent<NimbleButton>();
        var expectedMarkup = "nimble-button";

        Assert.Contains(expectedMarkup, drawer.Markup);
    }

    private IRenderedComponent<NimbleDrawer> RenderDrawerWithContent<TContent>()
        where TContent : IComponent
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleDrawer>(parameters => parameters.AddChildContent<TContent>());
    }
}
