using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleListOptionGroup : ComponentBase
{
    /// <summary>
    /// Gets or sets the hidden state of this group.
    /// </summary>
    [Parameter]
    public bool? Hidden { get; set; }

    /// <summary>
    /// Gets or sets the label of this group.
    /// </summary>
    [Parameter]
    public string? Label { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}
