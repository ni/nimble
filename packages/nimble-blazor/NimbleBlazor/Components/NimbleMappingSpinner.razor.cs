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
}
