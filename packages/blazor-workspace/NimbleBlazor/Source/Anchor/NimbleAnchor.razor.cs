using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleAnchor : NimbleAnchorBase
{
    /// <summary>
    /// Whether the text underline is hidden.
    /// </summary>
    [Parameter]
    public bool? UnderlineHidden { get; set; }

    /// <summary>
    /// Whether the anchor should behave like it is in an editable region.
    /// </summary>
    [Parameter]
    public string? ContentEditable { get; set; }

    /// <summary>
    /// The appearance of the anchor.
    /// </summary>
    [Parameter]
    public AnchorAppearance? Appearance { get; set; }

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
