using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvStickyHeader : ComponentBase
{
    /// <summary>
    /// The primary header rendered in the normal document flow.
    /// </summary>
    [Parameter]
    public RenderFragment? Header { get; set; }

    /// <summary>
    /// The alternate header rendered in a sticky overlay after the primary header leaves the viewport.
    /// </summary>
    [Parameter]
    public RenderFragment? StickyHeader { get; set; }

    /// <summary>
    /// Any additional attributes that did not match known properties.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
