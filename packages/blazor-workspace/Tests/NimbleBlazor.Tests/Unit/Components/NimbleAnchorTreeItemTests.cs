using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchorTreeItem"/>.
/// </summary>
public class NimbleAnchorTreeItemTests : NimbleAnchorBaseTests<NimbleAnchorTreeItem>
{
    [Fact]
    public void NimbleAnchorTreeItem_Render_HasAnchorTreeItemMarkup()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-anchor-tree-item";

        var menuItem = context.Render<NimbleAnchorTreeItem>();

        Assert.Contains(expectedMarkup, menuItem.Markup);
    }

    [Fact]
    public void NimbleAnchorTreeItem_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<NimbleAnchorTreeItem>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
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
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.Render<NimbleAnchorTreeItem>(p => p.Add(propertyGetter, propertyValue));
    }
}