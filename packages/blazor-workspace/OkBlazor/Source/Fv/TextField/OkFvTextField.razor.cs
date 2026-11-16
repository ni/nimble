using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvTextField : ComponentBase
{
    [Parameter]
    public string? Type { get; set; }

    [Parameter]
    public string? Value { get; set; }

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

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
