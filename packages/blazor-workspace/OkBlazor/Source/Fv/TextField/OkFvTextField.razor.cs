using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using NimbleBlazor;

namespace OkBlazor;

public partial class OkFvTextField : NimbleInputBase<string?>
{
    private ElementReference _element;
    private bool _maskOptionsChanged;

    [Inject]
    private IJSRuntime JSRuntime { get; set; } = null!;

    [Parameter]
    public IJSObjectReference? MaskOptions { get; set; }

    public override Task SetParametersAsync(ParameterView parameters)
    {
        _maskOptionsChanged |= parameters.TryGetValue<IJSObjectReference?>(nameof(MaskOptions), out _);
        return base.SetParametersAsync(parameters);
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (_maskOptionsChanged)
        {
            _maskOptionsChanged = false;
            await JSRuntime.InvokeVoidAsync("OkBlazor.setProperty", _element, "maskOptions", MaskOptions);
        }
    }

    [Parameter]
    public string? Type { get; set; }

    [Parameter]
    public string? Placeholder { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? ReadOnly { get; set; }

    [Parameter]
    public bool? Required { get; set; }

    [Parameter]
    public EventCallback<ChangeEventArgs> OnChange { get; set; }

    private async Task HandleChangeAsync(ChangeEventArgs args)
    {
        CurrentValueAsString = args.Value?.ToString();
        await OnChange.InvokeAsync(args);
    }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}
