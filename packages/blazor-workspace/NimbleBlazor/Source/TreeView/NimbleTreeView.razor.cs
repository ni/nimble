using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace NimbleBlazor;

public partial class NimbleTreeView : ComponentBase
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter]
    public bool? RenderCollapsedNodes { get; set; }

    [Parameter]
    public SelectionMode? SelectionMode { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    [Parameter]
    public EventCallback<EventArgs> Blur { get; set; }

    protected async void HandleBlur(EventArgs e)
    {
        await Blur.InvokeAsync(e);
    }
}
