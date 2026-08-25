using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace NimbleBlazor;

public partial class NimbleToolbar
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    [Parameter]
    public EventCallback<EventArgs> Blur { get; set; }

    protected async void HandleBlur(EventArgs e)
    {
        await Blur.InvokeAsync(e);
    }
}
