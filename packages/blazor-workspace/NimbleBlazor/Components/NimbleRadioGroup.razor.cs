using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleRadioGroup : NimbleInputBase<string>
{
    /// <summary>
    /// Gets or sets the disabled state.
    /// </summary>
    [Parameter]
    public bool? Disabled { get; set; }

    /// <summary>
    /// Gets or sets the name.
    /// </summary>
    [Parameter]
    public string? Name { get; set; }

    /// <summary>
    /// Gets or sets the Orientation of the group.
    /// </summary>
    [Parameter]
    public Orientation? Orientation { get; set; }

    /// <summary>
    /// Gets or sets the child content to be rendered inside the <see cref="NimbleRadioGroup"/>.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    protected override bool TryParseValueFromString(string? value, [MaybeNullWhen(false)] out string result, [NotNullWhen(false)] out string? validationErrorMessage)
    {
        result = value ?? string.Empty;
        validationErrorMessage = null;
        return true;
    }
}
