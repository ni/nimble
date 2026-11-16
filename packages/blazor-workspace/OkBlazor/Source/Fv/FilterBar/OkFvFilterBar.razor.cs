using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvFilterBar : ComponentBase
{
    [Parameter]
    public string? Label { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? ShowClearButton { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
