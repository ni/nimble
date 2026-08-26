using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace NimbleBlazor;

public partial class NimbleTabsToolbar : ComponentBase
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    [Parameter]
    public EventCallback<FocusEventArgs> Blur { get; set; }

    protected async void HandleBlur(FocusEventArgs e)
    {
        await Blur.InvokeAsync(e);
    }
}
