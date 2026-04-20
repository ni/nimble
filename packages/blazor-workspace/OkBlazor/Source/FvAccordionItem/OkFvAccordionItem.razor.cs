using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvAccordionItem : ComponentBase
{
    /// <summary>
    /// The header text shown in the accordion summary row.
    /// </summary>
    [Parameter]
    public string? Header { get; set; }

    /// <summary>
    /// The accordion appearance variant.
    /// </summary>
    [Parameter]
    public FvAccordionItemAppearance? Appearance { get; set; }

    /// <summary>
    /// Whether the accordion item is expanded.
    /// </summary>
    [Parameter]
    public bool? Expanded { get; set; }

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
