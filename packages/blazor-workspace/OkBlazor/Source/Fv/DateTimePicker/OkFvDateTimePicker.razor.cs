using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvDateTimePicker : ComponentBase
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
    public string? Value { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? Required { get; set; }

    [Parameter]
    public EventCallback<ChangeEventArgs> OnInput { get; set; }

    [Parameter]
    public EventCallback<ChangeEventArgs> OnChange { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
