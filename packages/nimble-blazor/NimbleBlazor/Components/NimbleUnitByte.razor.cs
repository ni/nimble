using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleUnitByte : ComponentBase
{
    /// <summary>
    /// Gets or sets whether the bytes units are 1024-based (rather than 1000-based).
    /// </summary>
    [Parameter]
    public bool? Binary { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
