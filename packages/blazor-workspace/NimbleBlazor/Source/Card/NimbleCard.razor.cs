using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleCard : ComponentBase
{
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}
