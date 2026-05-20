using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleSpinner : ComponentBase
{
    /// <summary>
    /// The appearance of the spinner
    /// </summary>
    [Parameter]

    public SpinnerAppearance? Appearance { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)] public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
