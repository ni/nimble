using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTableColumnText : ComponentBase
{
    [Parameter]
    [DisallowNull]
    public string FieldName { get; set; } = null!;

    [Parameter]
    public string? Placeholder { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}
