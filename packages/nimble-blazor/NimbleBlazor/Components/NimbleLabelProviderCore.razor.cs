using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

/// <summary>
/// Core Label Provider for Nimble
/// </summary>
public partial class NimbleLabelProviderCore : ComponentBase
{
    [Parameter]
    public string? PopupDismiss { get; set; }

    [Parameter]
    public string? NumericIncrement { get; set; }

    [Parameter]
    public string? NumericDecrement { get; set; }
}
