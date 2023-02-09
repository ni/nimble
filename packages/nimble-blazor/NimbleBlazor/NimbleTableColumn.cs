using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public abstract class NimbleTableColumn : ComponentBase
{
    /// <summary>
    /// The ID of the column of a <see cref="NimbleTable{TData}"/>
    /// </summary>
    [Parameter]
    public string? ColumnId { get; set; }
}
