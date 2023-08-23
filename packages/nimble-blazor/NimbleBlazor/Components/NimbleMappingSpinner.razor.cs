using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleMappingSpinner<TKey> : ComponentBase
{
    /// <summary>
    /// Gets or sets the key value being mapped.
    /// </summary>
    [Parameter]
    public TKey? Key { get; set; }

    /// <summary>
    /// Gets or sets the text used for the tooltip and accessible name of the spinner.
    /// </summary>
    [Parameter]
    public string? Text { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
