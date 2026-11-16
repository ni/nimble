using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace OkBlazor;

public partial class OkFvMultiSelect : ComponentBase
{
    private ElementReference _element;
    private bool _optionsChanged;
    private bool _selectedValuesChanged;

    [Inject]
    private IJSRuntime JSRuntime { get; set; } = null!;

    [Parameter]
    public IEnumerable<FvMultiSelectOption>? Options { get; set; }

    [Parameter]
    public IEnumerable<string>? SelectedValues { get; set; }

    [Parameter]
    public EventCallback<IEnumerable<string>> SelectedValuesChanged { get; set; }

    public override Task SetParametersAsync(ParameterView parameters)
    {
        _optionsChanged |= parameters.TryGetValue<IEnumerable<FvMultiSelectOption>?>(nameof(Options), out _);
        _selectedValuesChanged |= parameters.TryGetValue<IEnumerable<string>?>(nameof(SelectedValues), out _);
        return base.SetParametersAsync(parameters);
    }

    private Task HandleSelectionChangedAsync(FvMultiSelectEventArgs args) =>
        args.IsMultiSelect ? SelectedValuesChanged.InvokeAsync(args.SelectedValues) : Task.CompletedTask;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (_optionsChanged)
        {
            _optionsChanged = false;
            await JSRuntime.InvokeVoidAsync("OkBlazor.setProperty", _element, "options", Options ?? []);
        }
        if (_selectedValuesChanged)
        {
            _selectedValuesChanged = false;
            await JSRuntime.InvokeVoidAsync("OkBlazor.setProperty", _element, "selectedValues", SelectedValues ?? []);
        }
    }

    [Parameter]
    public string? Appearance { get; set; }

    [Parameter]
    public string? Label { get; set; }

    [Parameter]
    public string? Placeholder { get; set; }

    [Parameter]
    public bool? Filterable { get; set; }

    [Parameter]
    public bool? Clearable { get; set; }

    [Parameter]
    public bool? Open { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
