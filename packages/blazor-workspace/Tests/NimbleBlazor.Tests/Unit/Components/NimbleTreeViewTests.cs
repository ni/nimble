using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTreeView"/>
/// </summary>
public class NimbleTreeViewTests
{
    [Fact]
    public void NimbleTreeView_Rendered_HasNimbleTreeViewMarkup()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-tree-view";

        var treeView = context.Render<NimbleTreeView>();

        Assert.Contains(expectedMarkup, treeView.Markup);
    }

    [Fact]
    public void NimbleTreeView_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<NimbleTreeView>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(SelectionMode.LeavesOnly, "leaves-only")]
    [InlineData(SelectionMode.All, "all")]
    [InlineData(SelectionMode.None, "none")]
    public void TreeViewSelectionMode_AttributeIsSet(SelectionMode value, string expectedAttribute)
    {
        var treeView = RenderNimbleTreeView(value);

        Assert.Contains(expectedAttribute, treeView.Markup);
    }

    private IRenderedComponent<NimbleTreeView> RenderNimbleTreeView(SelectionMode selectionMode)
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.Render<NimbleTreeView>(p => p.Add(x => x.SelectionMode, selectionMode));
    }
}
