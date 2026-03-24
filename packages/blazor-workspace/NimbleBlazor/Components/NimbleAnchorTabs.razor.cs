using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

/// <summary>
/// A sequence of links styled as tabs.
/// </summary>
public partial class NimbleAnchorTabs : ComponentBase
{
    /// <summary>
    /// The child content of the element.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// The id of the contained NimbleAnchorTab that is marked as active.
    /// </summary>
    [Parameter]
    public string? ActiveId { get; set; }

    /// <summary>
    /// Any additional attributes that did not match known properties.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
