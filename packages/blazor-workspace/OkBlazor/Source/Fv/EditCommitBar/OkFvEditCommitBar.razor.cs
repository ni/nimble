using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace OkBlazor;

public partial class OkFvEditCommitBar : ComponentBase
{
    private ElementReference _element;
    private readonly string _eventSource = Guid.NewGuid().ToString();
    private bool _messageChanged;

    [Inject]
    private IJSRuntime JSRuntime { get; set; } = null!;

    [Parameter]
    public FvCommitMessage? Message { get; set; }

    [Parameter]
    public EventCallback<EventArgs> Save { get; set; }

    [Parameter]
    public EventCallback<EventArgs> Revert { get; set; }

    [Parameter]
    public EventCallback<EventArgs> DismissMessage { get; set; }

    private Task HandleSaveAsync(FvEventArgs args) =>
        args.Source == _eventSource ? Save.InvokeAsync(args) : Task.CompletedTask;

    private Task HandleRevertAsync(FvEventArgs args) =>
        args.Source == _eventSource ? Revert.InvokeAsync(args) : Task.CompletedTask;

    private Task HandleDismissMessageAsync(FvEventArgs args) =>
        args.Source == _eventSource ? DismissMessage.InvokeAsync(args) : Task.CompletedTask;

    public override Task SetParametersAsync(ParameterView parameters)
    {
        _messageChanged |= parameters.TryGetValue<FvCommitMessage?>(nameof(Message), out _);
        return base.SetParametersAsync(parameters);
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (_messageChanged)
        {
            _messageChanged = false;
            await JSRuntime.InvokeVoidAsync("OkBlazor.setProperty", _element, "message", Message);
        }
    }

    [Parameter]
    public string? Heading { get; set; }

    [Parameter]
    public int? ChangeCount { get; set; }

    [Parameter]
    public int? AffectedRowCount { get; set; }

    [Parameter]
    public int? HiddenAffectedRowCount { get; set; }

    [Parameter]
    public bool? SaveDisabled { get; set; }

    [Parameter]
    public bool? RevertDisabled { get; set; }

    [Parameter]
    public bool? ActionsHidden { get; set; }

    [Parameter]
    public bool? HideEmptySummary { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
