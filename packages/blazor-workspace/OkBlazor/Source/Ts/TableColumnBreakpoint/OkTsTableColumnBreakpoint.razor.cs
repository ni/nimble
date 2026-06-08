using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkTsTableColumnBreakpoint : ComponentBase
{
    /// <summary>
    /// The ID of the column.
    /// </summary>
    [Parameter]
    public string? ColumnId { get; set; }

    /// <summary>
    /// Gets or sets the field in the data record that contains the breakpoint state value.
    /// </summary>
    [Parameter]
    [DisallowNull]
    public string FieldName { get; set; } = null!;

    /// <summary>
    /// The name of the slot in which to render the context menu for this breakpoint column. If not provided, no context menu will be rendered.
    /// </summary>
    [Parameter]
    public string? MenuSlot { get; set; }

    /// <summary>
    /// Whether or not the column should be hidden.
    /// </summary>
    [Parameter]
    public bool? ColumnHidden { get; set; }

    /// <summary>
    /// Gets or sets a callback invoked when a breakpoint is toggled (clicked).
    /// </summary>
    [Parameter]
    public EventCallback<BreakpointColumnToggleEventArgs> BreakpointToggle { get; set; }

    /// <summary>
    /// Gets or sets a callback invoked when a breakpoint state change is requested.
    /// </summary>
    [Parameter]
    public EventCallback<BreakpointColumnStateChangeRequestedEventArgs> BreakpointStateChangeRequested { get; set; }

    /// <summary>
    /// Any additional attributes that did not match known properties.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
