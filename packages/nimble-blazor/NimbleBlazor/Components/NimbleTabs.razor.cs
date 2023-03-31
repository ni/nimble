using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

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
    /// Called when `change` event is called on the web component or its children
    /// </summary>
    /// <remarks>
    /// If <paramref name="value"/> is null, ignore the change event. Due to the way
    /// Blazor Custom Events work, this event gets triggered when a child <see cref="NimbleTextField"/>'s Value changes.
    /// </remarks>
    /// <param name="value">New value of activeid</param>
    protected async void UpdateActiveId(string? value)
    {
        if (value != null)
        {
            ActiveId = value;
            await ActiveIdChanged.InvokeAsync(value);
        }
    }

    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
