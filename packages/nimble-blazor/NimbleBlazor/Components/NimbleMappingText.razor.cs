using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleMappingText<TKey> : NimbleMappingBase<TKey>
{
    /// <summary>
    /// Gets or sets text that is either the mapped value, or a value that can be used for the tooltip and accessible name.
    /// </summary>
    [Parameter]
    public string? Text { get; set; }
}
