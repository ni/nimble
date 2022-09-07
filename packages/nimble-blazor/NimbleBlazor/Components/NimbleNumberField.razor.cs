using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleNumberField : NimbleInputBase<double?>
{
    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? ReadOnly { get; set; }

    [Parameter]
    public bool? Required { get; set; }

    [Parameter]
    public bool? AutoFocus { get; set; }

    [Parameter]
    public int? Size { get; set; }

    [Parameter]
    public string? Placeholder { get; set; }

    [Parameter]
    public NumberFieldAppearance? Appearance { get; set; }

    [Parameter]
    public int? MinLength { get; set; }

    [Parameter]
    public int? MaxLength { get; set; }

    [Parameter]
    public double Step { get; set; } = 1.0;

    [Parameter]
    public double Min { get; set; } = double.MinValue;

    [Parameter]
    public double Max { get; set; } = double.MaxValue;

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}
