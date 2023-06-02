using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchorMenuItem"/>.
/// </summary>
public class NimbleAnchorMenuItemTests : NimbleAnchorBaseTests<NimbleAnchorMenuItem>
{
    [Fact]
    public void NimbleAnchorMenuItem_Render_HasAnchorMenuItemMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-anchor-menu-item";

        var menuItem = context.RenderComponent<NimbleAnchorMenuItem>();

        Assert.Contains(expectedMarkup, menuItem.Markup);
    }

    [Fact]
    public void NimbleAnchorMenuItem_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleAnchorMenuItem>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void AnchorMenuItemDisabled_AttributeIsSet()
    {
        var anchorMenuItem = RenderWithPropertySet(x => x.Disabled, true);

        Assert.Contains("disabled", anchorMenuItem.Markup);
    }

    private IRenderedComponent<NimbleAnchorMenuItem> RenderWithPropertySet<TProperty>(Expression<Func<NimbleAnchorMenuItem, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleAnchorMenuItem>(p => p.Add(propertyGetter, propertyValue));
    }
}
