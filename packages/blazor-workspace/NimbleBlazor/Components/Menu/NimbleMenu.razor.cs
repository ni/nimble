using Microsoft.AspNetCore.Components;

namespace NationalInstruments.NimbleBlazor;

public partial class NimbleMenu : ComponentBase
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
