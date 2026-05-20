using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleStepper : ComponentBase
{
    /// <summary>
    /// The orientation of the stepper (horizontal or vertical).
    /// </summary>
    [Parameter]
    public Orientation? Orientation { get; set; }

    /// <summary>
    /// The child content of the element.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
