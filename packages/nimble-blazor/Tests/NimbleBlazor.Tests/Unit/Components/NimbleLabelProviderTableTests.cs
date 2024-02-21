using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleLabelProviderTable"/>.
/// </summary>
public class NimbleLabelProviderTableTests
{
    [Fact]
    public void NimbleLabelProviderTable_Render_HasLabelProviderMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-label-provider-table";

        var themeProvider = context.RenderComponent<NimbleLabelProviderTable>();

        Assert.Contains(expectedMarkup, themeProvider.Markup);
    }

    [Fact]
    public void NimbleLabelProviderTable_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleThemeProvider>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(nameof(NimbleLabelProviderTable.GroupCollapse))]
    [InlineData(nameof(NimbleLabelProviderTable.GroupExpand))]
    [InlineData(nameof(NimbleLabelProviderTable.CollapseAll))]
    [InlineData(nameof(NimbleLabelProviderTable.CellActionMenu))]
    [InlineData(nameof(NimbleLabelProviderTable.ColumnHeaderGrouped))]
    [InlineData(nameof(NimbleLabelProviderTable.ColumnHeaderSortedAscending))]
    [InlineData(nameof(NimbleLabelProviderTable.ColumnHeaderSortedDescending))]
    [InlineData(nameof(NimbleLabelProviderTable.SelectAll))]
    [InlineData(nameof(NimbleLabelProviderTable.GroupSelectAll))]
    [InlineData(nameof(NimbleLabelProviderTable.RowSelect))]
    [InlineData(nameof(NimbleLabelProviderTable.RowOperationColumn))]
    public void NimbleLabelProviderTable_LabelIsSet(string propertyName)
    {
        var labelValue = propertyName + "UpdatedValue";
        var labelProvider = RenderNimbleLabelProvider(propertyName, labelValue);

        Assert.Contains(labelValue, labelProvider.Markup);
    }

    private IRenderedComponent<NimbleLabelProviderTable> RenderNimbleLabelProvider(string propertyName, string labelValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleLabelProviderTable>(ComponentParameter.CreateParameter(propertyName, labelValue));
    }
}
