using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleMappingIcon<TKey> : ComponentBase
{
    /// <summary>
    /// Gets or sets the key value being mapped.
    /// </summary>
    [Parameter]
    public TKey? Key { get; set; }

    /// <summary>
    /// Gets or sets the text used for the tooltip and accessible name of the icon.
    /// </summary>
    [Parameter]
    public string? Text { get; set; }

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
}
