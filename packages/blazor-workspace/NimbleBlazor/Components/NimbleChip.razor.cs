using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleChip : ComponentBase
{
    [Parameter]
    public bool? Removable { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public ChipAppearance? Appearance { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a callback that's invoked when the chip remove button is activated.
    /// </summary>
    [Parameter]
    public EventCallback ChipRemoved { get; set; }

    /// <summary>
    /// Called when the chip remove button is activated.
    /// </summary>
    protected async void HandleRemove()
    {
        await ChipRemoved.InvokeAsync();
    }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
