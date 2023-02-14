using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTableColumnText : NimbleTableColumn
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

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}
