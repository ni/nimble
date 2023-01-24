using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

/// <summary>
/// A link styled as a tab
/// </summary>
public partial class NimbleAnchorTab : ComponentBase
{
    /// <summary>
    /// The child content of the element.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Whether the tab is disabled (not selectable)
    /// </summary>
    [Parameter]
    public bool? Disabled { get; set; }

    /// <summary>
    /// Any additional attributes that did not match known properties.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
