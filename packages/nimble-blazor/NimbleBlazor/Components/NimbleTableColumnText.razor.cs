using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTableColumnText : ComponentBase
{
    /// <summary>
    /// Gets or sets the field in the element representing a row of data in a <see cref="NimbleTable{TData}"/>to display
    /// </summary>
    [Parameter]
    [DisallowNull]
    public string FieldName { get; set; } = null!;

    /// <summary>
    /// The text to show when no value is available for a particular cell in the column of a <see cref="NimbleTable{TData}"/>
    /// </summary>
    [Parameter]
    public string? Placeholder { get; set; }

    /// <summary>
    /// The name of the slot containing the menu associated with this column.
    /// If not specified, no action menu will be associated with this column.
    /// </summary>
    [Parameter]
    public string? ActionMenuSlot { get; set; }

    /// <summary>
    /// The label to associate with the action menu on this column for accessibility purposes.
    /// This should be specified if <see cref="ActionMenuSlot"> is specified, but should not be specified otherwise.
    /// </summary>
    [Parameter]
    public string? ActionMenuLabel { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}
