using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleRadioButton : ComponentBase
{
    [Parameter]
    public string? Value { get; set; }

    [Parameter]
    public string? CurrentValue { get; set; }

    [Parameter]
    public bool Disabled { get; set; }

    [Parameter]
    public string? Name { get; set; }

    [Parameter]
    public bool? Checked { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
