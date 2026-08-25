using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;

namespace NimbleBlazor;

public partial class NimbleCheckbox : NimbleInputBase<bool>
{
    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? Required { get; set; }

    [Parameter]
    public bool? AppearanceIndeterminate { get; set; }

    [Parameter]
    public bool? ReadOnly { get; set; }

    [Parameter]
    public bool? ErrorVisible { get; set; }

    [Parameter]
    public string? ErrorText { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter]
    public EventCallback<FocusEventArgs> Blur { get; set; }

    protected override bool TryParseValueFromString(string? value, [MaybeNullWhen(false)] out bool result, [NotNullWhen(false)] out string? validationErrorMessage) => throw new NotSupportedException($"This component does not parse string inputs. Bind to the '{nameof(CurrentValue)}' property, not '{nameof(CurrentValueAsString)}'.");

    protected async void HandleBlur(FocusEventArgs e)
    {
        await Blur.InvokeAsync(e);
    }
}
