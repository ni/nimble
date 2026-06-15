using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTreeView"/>
/// </summary>
public class NimbleTreeViewTests : BunitTestBase
{
    [Fact]
    public void NimbleTreeView_Rendered_HasNimbleTreeViewMarkup()
    {
        var treeView = Render<NimbleTreeView>();

        Assert.NotNull(treeView.Find("nimble-tree-view"));
    }

    [Fact]
    public void NimbleTreeView_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleTreeView>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(SelectionMode.LeavesOnly, "leaves-only")]
    [InlineData(SelectionMode.All, "all")]
    [InlineData(SelectionMode.None, "none")]
    public void TreeViewSelectionMode_AttributeIsSet(SelectionMode value, string expectedAttribute)
    {
        var treeView = RenderNimbleTreeView(value);

        treeView.AssertAttribute("selection-mode", expectedAttribute);
    }

    private IRenderedComponent<NimbleTreeView> RenderNimbleTreeView(SelectionMode selectionMode)
    {
        return Render<NimbleTreeView>(p => p.Add(x => x.SelectionMode, selectionMode));
    }
}
