using Microsoft.AspNetCore.Components;
using NimbleBlazor;

namespace OkBlazor;

public partial class OkFvDateTimePicker : NimbleInputBase<string?>
{
    [Parameter]
    public string? Appearance { get; set; }

    [Parameter]
    public string? Type { get; set; }

    [Parameter]
    public string? Min { get; set; }

    [Parameter]
    public string? Max { get; set; }

    [Parameter]
    public string? Step { get; set; }

    [Parameter]
    public bool? ReadOnly { get; set; }

    [Parameter]
    public bool? AutoFocus { get; set; }

    [Parameter]
    public string? AutoComplete { get; set; }

    [Parameter]
    public string? Placeholder { get; set; }

    [Parameter]
    public bool? FullBleed { get; set; }

    [Parameter]
    public bool? AppearanceReadOnly { get; set; }

    [Parameter]
    public bool? Open { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? Required { get; set; }

    [Parameter]
    public EventCallback<ChangeEventArgs> OnInput { get; set; }

    [Parameter]
    public EventCallback<ChangeEventArgs> OnChange { get; set; }

    private async Task HandleInputAsync(ChangeEventArgs args)
    {
        CurrentValueAsString = args.Value?.ToString();
        await OnInput.InvokeAsync(args);
    }

    private async Task HandleChangeAsync(ChangeEventArgs args)
    {
        CurrentValueAsString = args.Value?.ToString();
        await OnChange.InvokeAsync(args);
    }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}
