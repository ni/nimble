using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

/// <summary>
/// Label Provider for the Nimble table component
/// </summary>
public partial class NimbleLabelProviderTable : ComponentBase
{
    [Parameter]
    public string? GroupCollapse { get; set; }

    [Parameter]
    public string? GroupExpand { get; set; }

    [Parameter]
    public string? CollapseAll { get; set; }

    [Parameter]
    public string? CellActionMenu { get; set; }

    [Parameter]
    public string? ColumnHeaderGrouped { get; set; }

    [Parameter]
    public string? ColumnHeaderSortedAscending { get; set; }

    [Parameter]
    public string? ColumnHeaderSortedDescending { get; set; }

    [Parameter]
    public string? SelectAll { get; set; }

    [Parameter]
    public string? GroupSelectAll { get; set; }

    [Parameter]
    public string? RowSelect { get; set; }

    [Parameter]
    public string? RowOperationColumn { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
