using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleMappingSpinner<TKey> : NimbleMappingBase<TKey>
{
    /// <summary>
    /// Gets or sets text for the tooltip and accessible name.
    /// </summary>
    [Parameter]
    public string? Text { get; set; }
}
