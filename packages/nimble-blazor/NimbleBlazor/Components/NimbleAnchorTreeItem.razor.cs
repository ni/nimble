using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleAnchorTreeItem : NimbleAnchorBase
{
    /// <summary>
    /// Whether the tree item is selected.
    /// </summary>
    [Parameter]
    public bool? Selected { get; set; }

    /// <summary>
    /// Whether the tree item is disabled.
    /// </summary>
    [Parameter]
    public bool? Disabled { get; set; }

    /// <summary>
    /// The child content of the element.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Any additional attributes that did not match known properties.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
