using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchorMenuItem"/>.
/// </summary>
public class NimbleAnchorMenuItemTests
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
    public void AnchorMenuItemHref_AttributeIsSet()
    {
        var anchorMenuItem = RenderWithPropertySet(x => x.Href, "foo");

        Assert.Contains("href=\"foo\"", anchorMenuItem.Markup);
    }

    [Fact]
    public void AnchorMenuItemHrefLang_AttributeIsSet()
    {
        var anchorMenuItem = RenderWithPropertySet(x => x.HrefLang, "foo");

        Assert.Contains("hreflang=\"foo\"", anchorMenuItem.Markup);
    }

    [Fact]
    public void AnchorMenuItemPing_AttributeIsSet()
    {
        var anchorMenuItem = RenderWithPropertySet(x => x.Ping, "foo");

        Assert.Contains("ping=\"foo\"", anchorMenuItem.Markup);
    }

    [Fact]
    public void AnchorMenuItemReferrerPolicy_AttributeIsSet()
    {
        var anchorMenuItem = RenderWithPropertySet(x => x.ReferrerPolicy, "foo");

        Assert.Contains("referrerpolicy=\"foo\"", anchorMenuItem.Markup);
    }

    [Fact]
    public void AnchorMenuItemRel_AttributeIsSet()
    {
        var anchorMenuItem = RenderWithPropertySet(x => x.Rel, "foo");

        Assert.Contains("rel=\"foo\"", anchorMenuItem.Markup);
    }

    [Fact]
    public void AnchorMenuItemTarget_AttributeIsSet()
    {
        var anchorMenuItem = RenderWithPropertySet(x => x.Target, "foo");

        Assert.Contains("target=\"foo\"", anchorMenuItem.Markup);
    }

    [Fact]
    public void AnchorMenuItemType_AttributeIsSet()
    {
        var anchorMenuItem = RenderWithPropertySet(x => x.Type, "foo");

        Assert.Contains("type=\"foo\"", anchorMenuItem.Markup);
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
