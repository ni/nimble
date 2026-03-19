using Microsoft.AspNetCore.Components;

namespace NationalInstruments.NimbleBlazor;

public partial class NimbleBreadcrumb : ComponentBase
{
    [Parameter]
    public BreadcrumbAppearance? Appearance { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
