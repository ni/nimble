using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleSpinner : ComponentBase
{
    /// <summary>
    /// The size of the spinner.
    /// </summary>
    [Parameter]
    public SpinnerSize? Size { get; set; }

    /// <summary>
    /// Any additional attributes that did not match known properties.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
