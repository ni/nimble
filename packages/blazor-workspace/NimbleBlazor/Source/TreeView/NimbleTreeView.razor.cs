using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTreeView : ComponentBase
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter]
    public bool? RenderCollapsedNodes { get; set; }

    [Parameter]
    public SelectionMode? SelectionMode { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
