using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvSplitButton : ComponentBase
{
    private readonly string _eventSource = Guid.NewGuid().ToString();

    [Parameter]
    public EventCallback<EventArgs> Trigger { get; set; }

    [Parameter]
    public EventCallback<FvToggleEventArgs> Toggle { get; set; }

    private Task HandleTriggerAsync(FvEventArgs args) =>
        args.Source == _eventSource ? Trigger.InvokeAsync(args) : Task.CompletedTask;

    private Task HandleToggleAsync(FvToggleEventArgs args) =>
        args.Source == _eventSource ? Toggle.InvokeAsync(args) : Task.CompletedTask;

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
