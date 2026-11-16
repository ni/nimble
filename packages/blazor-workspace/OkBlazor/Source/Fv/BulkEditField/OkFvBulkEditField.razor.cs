using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvBulkEditField : ComponentBase
{
    [Parameter]
    public string? Label { get; set; }

    [Parameter]
    public string? Status { get; set; }

    [Parameter]
    public bool? ResetDisabled { get; set; }

    [Parameter]
    public bool? ClearDisabled { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
