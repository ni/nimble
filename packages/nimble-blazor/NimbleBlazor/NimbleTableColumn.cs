using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public abstract class NimbleTableColumn : ComponentBase
{
    /// <summary>
    /// The ID of the column of a <see cref="NimbleTable{TData}"/>
    /// </summary>
    [Parameter]
    public string? ColumnId { get; set; }

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

    /// <summary>
    /// Whether or not the column should be hidden within a <see cref="NimbleTable{TData}"/>.
    /// </summary>
    [Parameter]
    public bool? ColumnHidden { get; set; }
}
