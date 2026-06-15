using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleLabelProviderTable"/>.
/// </summary>
public class NimbleLabelProviderTableTests : BunitTestBase
{
    [Fact]
    public void NimbleLabelProviderTable_Render_HasLabelProviderMarkup()
    {
        var themeProvider = Render<NimbleLabelProviderTable>();

        Assert.NotNull(themeProvider.Find("nimble-label-provider-table"));
    }

    [Fact]
    public void NimbleLabelProviderTable_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleThemeProvider>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(nameof(NimbleLabelProviderTable.GroupCollapse))]
    [InlineData(nameof(NimbleLabelProviderTable.GroupExpand))]
    [InlineData(nameof(NimbleLabelProviderTable.RowCollapse))]
    [InlineData(nameof(NimbleLabelProviderTable.RowExpand))]
    [InlineData(nameof(NimbleLabelProviderTable.CollapseAll))]
    [InlineData(nameof(NimbleLabelProviderTable.CellActionMenu))]
    [InlineData(nameof(NimbleLabelProviderTable.ColumnHeaderGrouped))]
    [InlineData(nameof(NimbleLabelProviderTable.ColumnHeaderSortedAscending))]
    [InlineData(nameof(NimbleLabelProviderTable.ColumnHeaderSortedDescending))]
    [InlineData(nameof(NimbleLabelProviderTable.SelectAll))]
    [InlineData(nameof(NimbleLabelProviderTable.GroupSelectAll))]
    [InlineData(nameof(NimbleLabelProviderTable.RowSelect))]
    [InlineData(nameof(NimbleLabelProviderTable.RowOperationColumn))]
    [InlineData(nameof(NimbleLabelProviderTable.RowLoading))]
    [InlineData(nameof(NimbleLabelProviderTable.GroupRowPlaceholderNoValue))]
    [InlineData(nameof(NimbleLabelProviderTable.GroupRowPlaceholderEmpty))]
    public void NimbleLabelProviderTable_LabelIsSet(string propertyName)
    {
        var labelValue = propertyName + "UpdatedValue";
        var labelProvider = RenderNimbleLabelProvider(propertyName, labelValue);

        labelProvider.AssertAttribute(AttributeHelpers.ConvertToAttributeString(propertyName), labelValue);
    }

    private IRenderedComponent<NimbleLabelProviderTable> RenderNimbleLabelProvider(string propertyName, string labelValue)
    {
        return Render<NimbleLabelProviderTable>(parameters => parameters.AddUnmatched(AttributeHelpers.ConvertToAttributeString(propertyName), labelValue));
    }
}
