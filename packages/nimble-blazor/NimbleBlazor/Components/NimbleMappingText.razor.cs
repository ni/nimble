using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleMappingText : ComponentBase
{
    /// <summary>
    /// Gets or sets the key value being mapped.
    /// </summary>
    [Parameter]
    public string? Key { get; set; }

    /// <summary>
    /// Gets or sets the text being mapped to.
    /// </summary>
    [Parameter]
    public string? Text { get; set; }
}
