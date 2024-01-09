using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleMappingIcon<TKey> : NimbleMappingBase<TKey>
{
    /// <summary>
    /// Gets or sets the (element name of the) Nimble icon being mapped to.
    /// </summary>
    [Parameter]
    public string? Icon { get; set; }

    /// <summary>
    /// Gets or sets the severity to use for the mapped icon.
    /// </summary>
    [Parameter]
    public IconSeverity? Severity { get; set; }

    /// <summary>
    /// Gets or sets text for the tooltip and accessible name.
    /// </summary>
    [Parameter]
    public string? Text { get; set; }
}
