using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvMasterDetailList : ComponentBase
{
    private readonly string _eventSource = Guid.NewGuid().ToString();

    [Parameter]
    public EventCallback<FvListChangeEventArgs> SelectionChanged { get; set; }

    private Task HandleSelectionChangedAsync(FvListChangeEventArgs args) =>
        args.Source == _eventSource ? SelectionChanged.InvokeAsync(args) : Task.CompletedTask;

    [Parameter]
    public string? Placeholder { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
