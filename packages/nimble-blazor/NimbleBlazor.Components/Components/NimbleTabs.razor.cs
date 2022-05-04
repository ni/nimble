using Microsoft.AspNetCore.Components;

namespace NimbleBlazor.Components;

public partial class NimbleTabs : ComponentBase
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter]
    public string? ActiveId { get; set; }

    /// <summary>
    /// Gets or sets a callback that's invoked when the activeid changes
    /// </summary>
    [Parameter] public EventCallback<string?> ActiveIdChanged { get; set; }

    /// <summary>
    /// Called when activeid changes on the web component
    /// </summary>
    /// <param name="value">New value of activeid</param>
    protected async void UpdateActiveId(string? value)
    {
        ActiveId = value;
        await ActiveIdChanged.InvokeAsync(value);
    }

    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
