using Microsoft.AspNetCore.Components;

namespace NimbleBlazor.Components;

public partial class NimbleTreeItem
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? Selected { get; set; }

    [Parameter]
    public bool? Expanded { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
