using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;


/// <summary>
/// A banner component for displaying persistent messages
/// </summary>
public partial class NimbleBanner : ComponentBase
{
    /// <summary>
    /// Whether the banner is displayed or not
    /// </summary>
    [Parameter]
    public bool? Open { get; set; }

    /// <summary>
    /// The severity of the message being displayed
    /// </summary>
    [Parameter]
    public BannerSeverity? Severity { get; set; }

    /// <summary>
    /// Whether the banner title is displayed or not
    /// </summary>
    [Parameter]
    public bool? TitleHidden { get; set; }

    /// <summary>
    /// Whether the dismiss button is present or not
    /// </summary>
    [Parameter]
    public bool? PreventDismiss { get; set; }

    /// <summary>
    /// The (hidden) label applied to the dismiss buton (for accessibility purposes)
    /// </summary>
    [Parameter]
    public string? DismissButtonLabel { get; set; }

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
