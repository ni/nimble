using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvContextHelp : ComponentBase
{
    [Parameter]
    public string? Text { get; set; }

    [Parameter]
    public string? TriggerLabel { get; set; }

    [Parameter]
    public string? Severity { get; set; }

    [Parameter]
    public bool? IconVisible { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
