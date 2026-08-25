using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace NimbleBlazor;

public partial class NimbleButton : ComponentBase
{
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

    [Parameter]
    public EventCallback<EventArgs> Blur { get; set; }

    protected async void HandleBlur(EventArgs e)
    {
        await Blur.InvokeAsync(e);
    }
}
