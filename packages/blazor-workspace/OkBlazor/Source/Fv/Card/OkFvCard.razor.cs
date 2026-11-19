using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvCard : ComponentBase
{
    [Parameter]
    public string? Title { get; set; }

    [Parameter]
    public string? Subtitle { get; set; }

    [Parameter]
    public string? Description { get; set; }

    [Parameter]
    public string? Appearance { get; set; }

    [Parameter]
    public string? InteractionMode { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public string? Initials { get; set; }

    [Parameter]
    public RenderFragment? Icon { get; set; }

    [Parameter]
    public RenderFragment? Badges { get; set; }

    [Parameter]
    public RenderFragment? FooterStart { get; set; }

    [Parameter]
    public RenderFragment? FooterEnd { get; set; }

    [Parameter]
    public RenderFragment? Actions { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
