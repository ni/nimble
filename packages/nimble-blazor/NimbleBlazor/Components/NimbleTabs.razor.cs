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

    private async void UpdateActiveId(string? value)
    {
        if (value != null)
        {
            ActiveId = value;
            await ActiveIdChanged.InvokeAsync(value);
        }
    }

    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
