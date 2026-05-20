using Microsoft.AspNetCore.Components;

namespace SprightBlazor;

/// <summary>
/// Base class for Spright icons.
/// </summary>
public abstract class SprightIconBase : ComponentBase
{
    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)] public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
