using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvSplitLayout : ComponentBase
{
    [Parameter]
    public EventCallback<FvPositionEventArgs> OnInput { get; set; }

    [Parameter]
    public EventCallback<FvPositionEventArgs> OnChange { get; set; }

    private Task HandleInputAsync(FvPositionEventArgs args) =>
        args.Source == "ok-fv-split-layout" ? OnInput.InvokeAsync(args) : Task.CompletedTask;

    private Task HandleChangeAsync(FvPositionEventArgs args) =>
        args.Source == "ok-fv-split-layout" ? OnChange.InvokeAsync(args) : Task.CompletedTask;

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
