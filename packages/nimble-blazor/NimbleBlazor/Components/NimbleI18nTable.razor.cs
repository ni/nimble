using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleI18nTable : ComponentBase
{
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    /// <summary>
    /// Gets or sets the tableGroupsCollapseAll label
    /// </summary>
    [Parameter]
    public string? TableGroupsCollapseAll { get; set; }
}
