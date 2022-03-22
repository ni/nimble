using Microsoft.AspNetCore.Components;

namespace NimbleBlazor.Components;

public partial class NimbleMenu
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
