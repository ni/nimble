using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvBulkEditField : ComponentBase
{
    private readonly string _eventSource = Guid.NewGuid().ToString();

    [Parameter]
    public EventCallback<EventArgs> Reset { get; set; }

    [Parameter]
    public EventCallback<EventArgs> Clear { get; set; }

    private Task HandleResetAsync(FvEventArgs args) =>
        args.Source == _eventSource ? Reset.InvokeAsync(args) : Task.CompletedTask;

    private Task HandleClearAsync(FvEventArgs args) =>
        args.Source == _eventSource ? Clear.InvokeAsync(args) : Task.CompletedTask;

    [Parameter]
    public string? Label { get; set; }

    [Parameter]
    public string? Status { get; set; }

    [Parameter]
    public bool? ResetDisabled { get; set; }

    [Parameter]
    public bool? ClearDisabled { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
