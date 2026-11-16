using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace OkBlazor;

public partial class OkFvFilterBar : ComponentBase
{
    private ElementReference _element;
    private bool _queryChanged;
    private bool _definitionChanged;

    [Inject]
    private IJSRuntime JSRuntime { get; set; } = null!;

    [Parameter]
    public object? Query { get; set; }

    [Parameter]
    public object? Definition { get; set; }

    [Parameter]
    public EventCallback<FvFilterBarEventArgs> EditFilter { get; set; }

    [Parameter]
    public EventCallback<FvFilterBarEventArgs> ClearFilter { get; set; }

    public override Task SetParametersAsync(ParameterView parameters)
    {
        _queryChanged |= parameters.TryGetValue<object?>(nameof(Query), out _);
        _definitionChanged |= parameters.TryGetValue<object?>(nameof(Definition), out _);
        return base.SetParametersAsync(parameters);
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (_queryChanged)
        {
            _queryChanged = false;
            await JSRuntime.InvokeVoidAsync("OkBlazor.setProperty", _element, "query", Query ?? new { version = 1, root = (object?)null });
        }
        if (_definitionChanged)
        {
            _definitionChanged = false;
            await JSRuntime.InvokeVoidAsync("OkBlazor.setProperty", _element, "definition", Definition);
        }
    }

    [Parameter]
    public string? Label { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? ShowClearButton { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
