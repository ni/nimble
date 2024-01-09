using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleMappingSpinner<TKey> : NimbleMappingBase<TKey>
{
    /// <summary>
    /// Gets or sets text that can be used for the tooltip and accessible name.
    /// </summary>
    [Parameter]
    public string? Text { get; set; }
}
