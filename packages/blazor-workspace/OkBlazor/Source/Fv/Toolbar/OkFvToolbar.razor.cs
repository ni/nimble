using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvToolbar : ComponentBase
{
    [Parameter]
    public string? OverflowLabel { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
