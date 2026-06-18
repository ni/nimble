using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
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
        var menuItem = Render<NimbleAnchorTreeItem>();

        Assert.NotNull(menuItem.Find("nimble-anchor-tree-item"));
    }

    [Fact]
    public void NimbleAnchorTreeItem_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleAnchorTreeItem>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void AnchorTreeItemSelected_AttributeIsSet()
    {
        var anchorTreeItem = RenderWithPropertySet(x => x.Selected, true);

        anchorTreeItem.AssertHasAttribute("selected");
    }

    [Fact]
    public void AnchorTreeItemDisabled_AttributeIsSet()
    {
        var anchorTreeItem = RenderWithPropertySet(x => x.Disabled, true);

        anchorTreeItem.AssertHasAttribute("disabled");
    }

    private IRenderedComponent<NimbleAnchorTreeItem> RenderWithPropertySet<TProperty>(Expression<Func<NimbleAnchorTreeItem, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleAnchorTreeItem>(p => p.Add(propertyGetter, propertyValue));
    }
}