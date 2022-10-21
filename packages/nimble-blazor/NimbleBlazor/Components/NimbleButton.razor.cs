using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleButton : ComponentBase
{
    [Parameter]
    public ButtonAppearance? Appearance { get; set; }

    [Parameter]
    public ButtonAppearanceVariant? AppearanceVariant { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? AutoFocus { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
