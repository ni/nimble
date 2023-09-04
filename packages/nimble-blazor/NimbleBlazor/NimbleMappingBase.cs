using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public abstract class NimbleMappingBase<TKey> : ComponentBase
{
    /// <summary>
    /// Gets or sets the key value being mapped.
    /// </summary>
    [Parameter]
    public TKey? Key { get; set; }

    public string? FormattedKey => (Key is bool b) ? (b ? "true" : "false") : Key?.ToString();

    /// <summary>
    /// Gets or sets text that is either the mapped value, or a value that can be used for the tooltip and accessible name.
    /// </summary>
    [Parameter]
    public string? Text { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
