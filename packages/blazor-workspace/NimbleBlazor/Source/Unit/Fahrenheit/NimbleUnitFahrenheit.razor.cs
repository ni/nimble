using Microsoft.AspNetCore.Components;

namespace NationalInstruments.NimbleBlazor;

public partial class NimbleUnitFahrenheit : ComponentBase
{
    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
