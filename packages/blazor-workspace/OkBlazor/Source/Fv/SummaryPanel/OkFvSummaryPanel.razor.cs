using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvSummaryPanel : ComponentBase
{
    [Parameter]
    public bool? ShowEditItemsButton { get; set; }

    [Parameter]
    public bool? LegacyStyle { get; set; }

    [Parameter]
    public string? Size { get; set; }

    [Parameter]
    public string? EditItemsButtonLabel { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
