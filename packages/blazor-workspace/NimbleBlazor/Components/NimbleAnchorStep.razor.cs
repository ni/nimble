using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleAnchorStep : NimbleAnchorBase
{
    /// <summary>
    /// The severity of the step (default, error, warning, success).
    /// </summary>
    [Parameter]
    public AnchorStepSeverity? Severity { get; set; }

    /// <summary>
    /// Whether the step is disabled.
    /// </summary>
    [Parameter]
    public bool? Disabled { get; set; }

    /// <summary>
    /// Whether the step is readonly.
    /// </summary>
    [Parameter]
    public bool? ReadOnly { get; set; }

    /// <summary>
    /// Whether the step is visually selected.
    /// </summary>
    [Parameter]
    public bool? Selected { get; set; }

    /// <summary>
    /// The child content of the element.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Any additional attributes that did not match known properties.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
