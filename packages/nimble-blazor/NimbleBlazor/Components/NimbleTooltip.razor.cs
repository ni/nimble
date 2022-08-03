using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTooltip : ComponentBase
{
    [Parameter]
    public string? Anchor { get; set; }

    [Parameter]
    public int? Delay { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
