using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleThemeProvider : ComponentBase
{
    [Parameter]
    public Direction? Direction { get; set; }

    [Parameter]
    public Theme? Theme { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
