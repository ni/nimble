using Microsoft.AspNetCore.Components;

namespace OkBlazor;

[SuppressMessage("Naming", "NI1704", Justification = "Matches the FV component name.")]
public partial class OkFvSplitter : ComponentBase
{
    [Parameter]
    public string? AriaLabel { get; set; }

    [Parameter]
    public string? AriaLabelledBy { get; set; }

    [Parameter]
    public string? AriaControls { get; set; }

    [Parameter]
    public double? Position { get; set; }

    [Parameter]
    public double? Min { get; set; }

    [Parameter]
    public double? Max { get; set; }

    [Parameter]
    public double? Step { get; set; }

    [Parameter]
    public EventCallback<FvPositionEventArgs> OnInput { get; set; }

    [Parameter]
    public EventCallback<FvPositionEventArgs> OnChange { get; set; }

    private Task HandleInputAsync(FvPositionEventArgs args) =>
        args.Source == "ok-fv-splitter" ? OnInput.InvokeAsync(args) : Task.CompletedTask;

    private Task HandleChangeAsync(FvPositionEventArgs args) =>
        args.Source == "ok-fv-splitter" ? OnChange.InvokeAsync(args) : Task.CompletedTask;

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
