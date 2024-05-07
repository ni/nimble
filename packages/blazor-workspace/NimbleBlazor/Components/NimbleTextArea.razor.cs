using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTextArea : NimbleInputBase<string?>
{
    /// <summary>
    /// Gets or sets whether the control is disabled
    /// </summary>
    [Parameter]
    public bool? Disabled { get; set; }

    /// <summary>
    /// Gets or sets whether the control is non-editable
    /// </summary>
    [Parameter]
    public bool? ReadOnly { get; set; }

    /// <summary>
    /// Gets or sets whether the control is required for form submission
    /// </summary>
    [Parameter]
    public bool? Required { get; set; }

    /// <summary>
    /// Gets or sets whether the control is auto-focused upon display
    /// </summary>
    [Parameter]
    public bool? AutoFocus { get; set; }

    /// <summary>
    /// Gets or sets the control appearance mode
    /// </summary>
    [Parameter]
    public TextAreaAppearance? Appearance { get; set; }

    /// <summary>
    /// Gets or sets which directions the control can be resized in
    /// </summary>
    [Parameter]
    public TextAreaResize? TextAreaResize { get; set; }

    /// <summary>
    /// Gets or sets placeholder text that is displayed when the control is otherwise empty
    /// </summary>
    [Parameter]
    public string? Placeholder { get; set; }

    /// <summary>
    /// Gets or sets whether the error state is displayed
    /// </summary>
    [Parameter]
    public bool? ErrorVisible { get; set; }

    /// <summary>
    /// Gets or sets an error message describing the error state
    /// </summary>
    [Parameter]
    public string? ErrorText { get; set; }

    /// <summary>
    /// Gets or sets the minimum number of characters that should be input
    /// </summary>
    [Parameter]
    public int? MinLength { get; set; }

    /// <summary>
    /// Gets or sets the maximum number of characters that can be input
    /// </summary>
    [Parameter]
    public int? MaxLength { get; set; }

    /// <summary>
    /// Gets or sets the number of visible rows of text
    /// </summary>
    [Parameter]
    public int? Rows { get; set; }

    /// <summary>
    /// Gets or sets the number of visible characters per row
    /// </summary>
    [Parameter]
    public int? Cols { get; set; }

    /// <summary>
    /// Gets or sets whether the control should be spellchecked by the browser
    /// </summary>
    [Parameter]
    public bool? Spellcheck { get; set; }

    /// <summary>
    /// Gets or sets the child content of the control
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    protected override bool TryParseValueFromString(string? value, out string? result, [NotNullWhen(false)] out string? validationErrorMessage)
    {
        result = value;
        validationErrorMessage = null;
        return true;
    }
}
