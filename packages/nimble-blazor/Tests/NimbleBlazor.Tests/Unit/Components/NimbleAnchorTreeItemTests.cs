using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchorTreeItem"/>.
/// </summary>
public class NimbleAnchorTreeItemTests
{
    [Fact]
    public void NimbleAnchorTreeItem_Render_HasAnchorTreeItemMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-anchor-tree-item";

        var menuItem = context.RenderComponent<NimbleAnchorTreeItem>();

        Assert.Contains(expectedMarkup, menuItem.Markup);
    }

    [Fact]
    public void AnchorTreeItemHref_AttributeIsSet()
    {
        var anchorTreeItem = RenderWithPropertySet(x => x.Href, "foo");

        Assert.Contains("href=\"foo\"", anchorTreeItem.Markup);
    }

    [Fact]
    public void AnchorTreeItemHrefLang_AttributeIsSet()
    {
        var anchorTreeItem = RenderWithPropertySet(x => x.HrefLang, "foo");

        Assert.Contains("hreflang=\"foo\"", anchorTreeItem.Markup);
    }

    [Fact]
    public void AnchorTreeItemPing_AttributeIsSet()
    {
        var anchorTreeItem = RenderWithPropertySet(x => x.Ping, "foo");

        Assert.Contains("ping=\"foo\"", anchorTreeItem.Markup);
    }

    [Fact]
    public void AnchorTreeItemReferrerPolicy_AttributeIsSet()
    {
        var anchorTreeItem = RenderWithPropertySet(x => x.ReferrerPolicy, "foo");

        Assert.Contains("referrerpolicy=\"foo\"", anchorTreeItem.Markup);
    }

    [Fact]
    public void AnchorTreeItemRel_AttributeIsSet()
    {
        var anchorTreeItem = RenderWithPropertySet(x => x.Rel, "foo");

        Assert.Contains("rel=\"foo\"", anchorTreeItem.Markup);
    }

    [Fact]
    public void AnchorTreeItemTarget_AttributeIsSet()
    {
        var anchorTreeItem = RenderWithPropertySet(x => x.Target, "foo");

        Assert.Contains("target=\"foo\"", anchorTreeItem.Markup);
    }

    [Fact]
    public void AnchorTreeItemType_AttributeIsSet()
    {
        var anchorTreeItem = RenderWithPropertySet(x => x.Type, "foo");

        Assert.Contains("type=\"foo\"", anchorTreeItem.Markup);
    }

    [Fact]
    public void AnchorTreeItemSelected_AttributeIsSet()
    {
        var anchorTreeItem = RenderWithPropertySet(x => x.Selected, true);

        Assert.Contains("selected", anchorTreeItem.Markup);
    }

    [Fact]
    public void AnchorTreeItemDisabled_AttributeIsSet()
    {
        var anchorTreeItem = RenderWithPropertySet(x => x.Disabled, true);

        Assert.Contains("disabled", anchorTreeItem.Markup);
    }

    private IRenderedComponent<NimbleAnchorTreeItem> RenderWithPropertySet<TProperty>(Expression<Func<NimbleAnchorTreeItem, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleAnchorTreeItem>(p => p.Add(propertyGetter, propertyValue));
    }
}