using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace NimbleBlazor;

public partial class NimbleToggleButton : NimbleInputBase<bool>
{
    [Parameter]
    public ButtonAppearance? Appearance { get; set; }

    [Parameter]
    public ButtonAppearanceVariant? AppearanceVariant { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? ContentHidden { get; set; }

    [Parameter]
    public bool? AutoFocus { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter]
    public EventCallback<EventArgs> Blur { get; set; }

    protected override bool TryParseValueFromString(string? value, [MaybeNullWhen(false)] out bool result, [NotNullWhen(false)] out string? validationErrorMessage) => throw new NotSupportedException($"This component does not parse string inputs. Bind to the '{nameof(CurrentValue)}' property, not '{nameof(CurrentValueAsString)}'.");

    protected async void HandleBlur(EventArgs e)
    {
        await Blur.InvokeAsync(e);
    }
}
