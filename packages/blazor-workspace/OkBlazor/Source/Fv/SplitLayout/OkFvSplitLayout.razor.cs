using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvSplitLayout : ComponentBase
{
    [Parameter]
    public double? Position { get; set; }

    [Parameter]
    public double? Min { get; set; }

    [Parameter]
    public double? Max { get; set; }

    [Parameter]
    public double? MinSecondaryPixels { get; set; }

    [Parameter]
    public bool? Collapsed { get; set; }

    [Parameter]
    public double? Step { get; set; }

    [Parameter]
    public string? PrimaryPaneId { get; set; }

    [Parameter]
    public string? SecondaryPaneId { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
