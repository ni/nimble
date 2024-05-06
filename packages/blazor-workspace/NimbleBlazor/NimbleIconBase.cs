using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

/// <summary>
/// Base class for Nimble icons.
/// </summary>
public abstract class NimbleIconBase : ComponentBase
{
    [Parameter]
    public IconSeverity? Severity { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)] public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
