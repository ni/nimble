using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleAnchorButton : NimbleAnchorBase
{
    /// <summary>
    /// The appearance mode of the button.
    /// </summary>
    [Parameter]
    public ButtonAppearance? Appearance { get; set; }

    /// <summary>
    /// The appearance variant of the button.
    /// </summary>
    [Parameter]
    public ButtonAppearanceVariant? AppearanceVariant { get; set; }

    /// <summary>
    /// Whether the text content of the button is hidden.
    /// </summary>
    [Parameter]
    public bool? ContentHidden { get; set; }

    /// <summary>
    /// Whether the button is disabled.
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
