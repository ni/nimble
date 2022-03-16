using Microsoft.AspNetCore.Components;

namespace NI.Nimble.Blazor.Components;

public partial class NimbleButton
{
    [Parameter]
    public Appearance? Appearance { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? Autofocus { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
