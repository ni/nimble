using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvChipSelector : ComponentBase
{
    private readonly string _eventSource = Guid.NewGuid().ToString();

    [Parameter]
    public EventCallback<FvMultiSelectEventArgs> SelectionChanged { get; set; }

    private Task HandleSelectionChangedAsync(FvMultiSelectEventArgs args) =>
        args.Source == _eventSource ? SelectionChanged.InvokeAsync(args) : Task.CompletedTask;

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? Open { get; set; }

    [Parameter]
    public string? Label { get; set; }

    [Parameter]
    public string? SelectedValues { get; set; }

    [Parameter]
    public string? Options { get; set; }

    [Parameter]
    public string? Placeholder { get; set; }

    [Parameter]
    public bool? AllowCustomValues { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
