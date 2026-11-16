using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvMultiSelect : ComponentBase
{
    [Parameter]
    public string? Appearance { get; set; }

    [Parameter]
    public string? Label { get; set; }

    [Parameter]
    public string? Placeholder { get; set; }

    [Parameter]
    public bool? Filterable { get; set; }

    [Parameter]
    public bool? Clearable { get; set; }

    [Parameter]
    public bool? Open { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
