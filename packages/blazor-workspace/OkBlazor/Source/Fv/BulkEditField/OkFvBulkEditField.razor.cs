using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvBulkEditField : ComponentBase
{
    [Parameter]
    public EventCallback<EventArgs> Reset { get; set; }

    [Parameter]
    public EventCallback<EventArgs> Clear { get; set; }

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
