using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvSummaryPanelTile : ComponentBase
{
    [Parameter]
    public string? Count { get; set; }

    [Parameter]
    public string? Label { get; set; }

    [Parameter]
    public bool? LegacyStyle { get; set; }

    [Parameter]
    public string? Size { get; set; }

    [Parameter]
    public bool? Selected { get; set; }

    [Parameter]
    public string? TextPosition { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
