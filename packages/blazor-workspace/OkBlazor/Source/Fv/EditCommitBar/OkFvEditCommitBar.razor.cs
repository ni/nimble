using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvEditCommitBar : ComponentBase
{
    [Parameter]
    public string? Heading { get; set; }

    [Parameter]
    public int? ChangeCount { get; set; }

    [Parameter]
    public int? AffectedRowCount { get; set; }

    [Parameter]
    public int? HiddenAffectedRowCount { get; set; }

    [Parameter]
    public bool? SaveDisabled { get; set; }

    [Parameter]
    public bool? RevertDisabled { get; set; }

    [Parameter]
    public bool? ActionsHidden { get; set; }

    [Parameter]
    public bool? HideEmptySummary { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
