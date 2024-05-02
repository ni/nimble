using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleListOption : NimbleListOptionBase<string>
{
    [Parameter]
    public bool Disabled { get; set; }

    /// <summary>
    /// Gets or sets the value of this option.
    /// </summary>
    [Parameter]
    public string? Value { get; set; }

    /// <summary>
    /// Gets or sets the name of the parent container component.
    /// </summary>
    [Parameter] public string? Name { get; set; }

    [Parameter]
    public bool Selected { get; set; }

    [Parameter]
    public bool Hidden { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }


    [CascadingParameter] private NimbleOptionContext? CascadedContext { get; set; }

    public async Task OnClickHandlerAsync()
    {
        if (Disabled)
        {
            return;
        }

        Selected = !Selected;

        if (InternalListContext != null &&
            InternalListContext.ValueChanged.HasDelegate)
        {
            await InternalListContext.ValueChanged.InvokeAsync(Value);
        }
    }
}
