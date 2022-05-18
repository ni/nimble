using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTabsToolbar : ComponentBase
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
