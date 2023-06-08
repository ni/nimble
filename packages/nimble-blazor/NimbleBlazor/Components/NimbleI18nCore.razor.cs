using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleI18nCore : ComponentBase
{
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    /// <summary>
    /// Gets or sets the bannerDismiss label
    /// </summary>
    [Parameter]
    public string? BannerDismiss { get; set; }

    /// <summary>
    /// Gets or sets the numberFieldIncrement label
    /// </summary>
    [Parameter]
    public string? NumberFieldIncrement { get; set; }

    /// <summary>
    /// Gets or sets the numberFieldDecrement label
    /// </summary>
    [Parameter]
    public string? NumberFieldDecrement { get; set; }
}
