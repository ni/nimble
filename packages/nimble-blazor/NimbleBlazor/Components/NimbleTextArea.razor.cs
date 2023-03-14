using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTextArea : NimbleInputBase<string?>
{
    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? ReadOnly { get; set; }

    [Parameter]
    public bool? Required { get; set; }

    [Parameter]
    public bool? AutoFocus { get; set; }

    [Parameter]
    public int? Size { get; set; }

    [Parameter]
    public TextAreaAppearance? Appearance { get; set; }

    [Parameter]
    public TextAreaResize? TextAreaResize { get; set; }

    [Parameter]
    public string? Placeholder { get; set; }

    [Parameter]
    public bool? ErrorVisible { get; set; }

    [Parameter]
    public string? ErrorText { get; set; }

    [Parameter]
    public int? MinLength { get; set; }

    [Parameter]
    public int? MaxLength { get; set; }

    [Parameter]
    public int? Rows { get; set; }

    [Parameter]
    public int? Cols { get; set; }

    [Parameter]
    public bool? Spellcheck { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    protected override bool TryParseValueFromString(string? value, out string? result, [NotNullWhen(false)] out string? validationErrorMessage)
    {
        result = value;
        validationErrorMessage = null;
        return true;
    }
}
