using Microsoft.AspNetCore.Components;

namespace SprightBlazor;

public partial class SprightAccordion : ComponentBase
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
