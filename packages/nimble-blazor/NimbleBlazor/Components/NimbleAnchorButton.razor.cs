using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleAnchorButton : ComponentBase
{
    /// <summary>
    /// The URL the hyperlink references. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a for more information.
    /// </summary>
    [Parameter]
    public string? Href { get; set; }

    /// <summary>
    /// Hints at the human language of the linked URL. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a for more information.
    /// </summary>
    [Parameter]
    public string? HrefLang { get; set; }

    /// <summary>
    /// A space-separated list of URLs. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a for more information.
    /// </summary>
    [Parameter]
    public string? Ping { get; set; }

    /// <summary>
    /// How much of the referrer to send when following the link. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a for more information.
    /// </summary>
    [Parameter]
    public string? ReferrerPolicy { get; set; }

    /// <summary>
    /// The relationship of the linked URL as space-separated link types. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a for more information.
    /// </summary>
    [Parameter]
    public string? Rel { get; set; }

    /// <summary>
    /// Where to display the linked URL, as the name for a browsing context. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a for more information.
    /// </summary>
    [Parameter]
    public string? Target { get; set; }

    /// <summary>
    /// Hints at the linked URL's format with a MIME type. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a for more information.
    /// </summary>
    [Parameter]
    public string? Type { get; set; }

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
