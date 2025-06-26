using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public abstract class NimbleAnchorBase : ComponentBase
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
}