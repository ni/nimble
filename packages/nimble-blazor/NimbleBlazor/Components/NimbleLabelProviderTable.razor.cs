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
    public string? GroupsCollapseAll { get; set; }

    [Parameter]
    public string? CellActionMenu { get; set; }

    [Parameter]
    public string? ColumnHeaderGrouped { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
