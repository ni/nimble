using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvSplitButton : ComponentBase
{
    [Parameter]
    public EventCallback<EventArgs> Trigger { get; set; }

    [Parameter]
    public EventCallback<FvToggleEventArgs> Toggle { get; set; }

    [Parameter]
    public string? Label { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? Open { get; set; }

    [Parameter]
    public string? Appearance { get; set; }

    [Parameter]
    public string? AppearanceVariant { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
