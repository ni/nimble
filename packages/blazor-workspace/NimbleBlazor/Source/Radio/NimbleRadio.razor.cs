using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace NimbleBlazor;

public partial class NimbleRadio : ComponentBase
{
    /// <summary>
    /// Gets or sets the value.
    /// </summary>
    [Parameter]
    public string? CurrentValue { get; set; }

    /// <summary>
    /// Gets or sets the disabled state.
    /// </summary>
    [Parameter]
    public bool Disabled { get; set; }

    /// <summary>
    /// Gets or sets the name.
    /// </summary>
    [Parameter]
    public string? Name { get; set; }

    /// <summary>
    /// Gets or sets the child content to be rendered inside the <see cref="NimbleRadio"/>.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets any additional attributes to set on the element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    [Parameter]
    public EventCallback<EventArgs> Blur { get; set; }

    protected async void HandleBlur(EventArgs e)
    {
        await Blur.InvokeAsync(e);
    }
}
