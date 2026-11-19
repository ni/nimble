using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvMasterDetailListItem : ComponentBase
{
    [Parameter]
    public string? TitleText { get; set; }

    [Parameter]
    public string? Subtitle { get; set; }

    [Parameter]
    public string? Value { get; set; }

    [Parameter]
    public bool? Compact { get; set; }

    [Parameter]
    public bool? Selected { get; set; }

    [Parameter]
    public string? StatusColor { get; set; }

    [Parameter]
    public string? StatusLabel { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
