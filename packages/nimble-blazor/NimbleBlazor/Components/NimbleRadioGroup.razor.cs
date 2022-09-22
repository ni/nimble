using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleRadioGroup : NimbleInputBase<string>
{
    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public string? Name { get; set; }

    [Parameter]
    public Orientation? Orientation { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    protected override bool TryParseValueFromString(string? value, [MaybeNullWhen(false)] out string result, [NotNullWhen(false)] out string? validationErrorMessage)
    {
        result = value ?? "";
        validationErrorMessage = null;
        return true;
    }
}
