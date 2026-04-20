using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvSearchInput : ComponentBase
{
    /// <summary>
    /// The FV search input appearance variant.
    /// </summary>
    [Parameter]
    public FvSearchInputAppearance? Appearance { get; set; }

    /// <summary>
    /// The placeholder text displayed when the input has no value.
    /// </summary>
    [Parameter]
    public string? Placeholder { get; set; }

    /// <summary>
    /// The current text value of the FV search input.
    /// </summary>
    [Parameter]
    public string? Value { get; set; }

    /// <summary>
    /// Any additional attributes that did not match known properties.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}