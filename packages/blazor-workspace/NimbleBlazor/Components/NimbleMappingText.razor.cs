using Microsoft.AspNetCore.Components;

namespace NationalInstruments.NimbleBlazor;

public partial class NimbleMappingText<TKey> : NimbleMappingBase<TKey>
{
    /// <summary>
    /// Gets or sets text for the mapped value, tooltip, and accessible name.
    /// </summary>
    [Parameter]
    public string? Text { get; set; }
}
