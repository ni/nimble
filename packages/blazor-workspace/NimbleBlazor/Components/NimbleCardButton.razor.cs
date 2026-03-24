using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleCardButton : ComponentBase
{
    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? Selected { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
