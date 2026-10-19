using Microsoft.AspNetCore.Components;

namespace SprightBlazor;

/// <summary>
/// Label provider for Spright chat components.
/// </summary>
public partial class SprightLabelProviderChat : ComponentBase
{
    [Parameter]
    public string? Send { get; set; }

    [Parameter]
    public string? Stop { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}