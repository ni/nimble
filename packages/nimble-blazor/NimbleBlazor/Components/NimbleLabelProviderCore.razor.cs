using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

/// <summary>
/// Core Label Provider for Nimble
/// </summary>
public partial class NimbleLabelProviderCore : ComponentBase
{
    [Parameter]
    public string? PopupDismiss { get; set; }

    [Parameter]
    public string? NumericIncrement { get; set; }

    [Parameter]
    public string? NumericDecrement { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
