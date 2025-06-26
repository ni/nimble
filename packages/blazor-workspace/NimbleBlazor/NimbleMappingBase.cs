using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public abstract class NimbleMappingBase<TKey> : ComponentBase
{
    /// <summary>
    /// Gets or sets the key value being mapped.
    /// </summary>
    [Parameter]
    public TKey? Key { get; set; }

#pragma warning disable RCS1238 // Avoid nested ?: operators.
    public string? FormattedKey => (Key is bool b) ? (b ? "true" : "false") : Key?.ToString();
#pragma warning restore RCS1238 // Avoid nested ?: operators.

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
