using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleMappingSpinner<TKey> : NimbleMappingBase<TKey>
{
    /// <summary>
    /// Gets or sets text for the tooltip and accessible name.
    /// </summary>
    [Parameter]
    public string? Text { get; set; }

    /// <summary>
    /// Gets or sets whether or not the mapping's text should be rendered in the table's cells.
    /// </summary>
    [Parameter]
    public bool TextHidden { get; set; }
}
