using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTextField : NimbleInputBase<string?>
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
    public TextFieldAppearance? Appearance { get; set; }

    [Parameter]
    public TextFieldType? TextFieldType { get; set; }

    [Parameter]
    public string? Placeholder { get; set; }

    [Parameter]
    public int? MinLength { get; set; }

    [Parameter]
    public int? MaxLength { get; set; }

    [Parameter]
    public bool? Spellcheck { get; set; }

    /// <summary>
    /// Gets or sets whether the combobox error text
    /// </summary>
    [Parameter]
    public string? ErrorText { get; set; }

    /// <summary>
    /// Gets or sets whether the combobox error is visible
    /// </summary>
    [Parameter]
    public bool? ErrorVisible { get; set; }

    [Parameter]
    public bool? FullBleed { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    protected override bool TryParseValueFromString(string? value, out string? result, [NotNullWhen(false)] out string? validationErrorMessage)
    {
        result = value;
        validationErrorMessage = null;
        return true;
    }
}
