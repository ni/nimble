using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleAnchorButton : ComponentBase
{
    [Parameter]
    public string? Href { get; set; }

    [Parameter]
    public string? HrefLang { get; set; }

    [Parameter]
    public string? Ping { get; set; }

    [Parameter]
    public string? ReferrerPolicy { get; set; }

    [Parameter]
    public string? Rel { get; set; }

    [Parameter]
    public string? Target { get; set; }

    [Parameter]
    public string? Type { get; set; }

    [Parameter]
    public ButtonAppearance? Appearance { get; set; }

    [Parameter]
    public ButtonAppearanceVariant? AppearanceVariant { get; set; }

    [Parameter]
    public bool? ContentHidden { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? AutoFocus { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
