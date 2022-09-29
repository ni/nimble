using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

/// <summary>
/// The Blazor wrapper for the 'nimble-number-field' web component
/// </summary>
public partial class NimbleNumberField : NimbleInputBase<double?>
{
    /// <summary>
    /// Gets or sets the disabled state of the number field.
    /// </summary>
    [Parameter]
    public bool? Disabled { get; set; }

    /// <summary>
    /// Gets or sets the readonly state of the number field.
    /// </summary>
    [Parameter]
    public bool? ReadOnly { get; set; }

    /// <summary>
    /// Gets or sets the placeholder text of the number field.
    /// </summary>
    [Parameter]
    public string? Placeholder { get; set; }

    /// <summary>
    /// Gets or sets the <see cref="NumberFieldAppearance"/> of the number field.
    /// </summary>
    [Parameter]
    public NumberFieldAppearance? Appearance { get; set; }

    /// <summary>
    /// Gets or sets the step value of the number field.
    /// </summary>
    /// <remarks>default is 1.0</remarks>
    [Parameter]
    public double Step { get; set; } = 1.0;

    /// <summary>
    /// Gets or sets the min value of the number field.
    /// </summary>
    /// <remarks>default is <see cref="double.MinValue"/></remarks>
    [Parameter]
    public double Min { get; set; } = double.MinValue;

    /// <summary>
    /// Gets or sets the max value of the number field.
    /// </summary>
    /// <remarks>default is <see cref="double.MaxValue"/></remarks>
    [Parameter]
    public double Max { get; set; } = double.MaxValue;

    /// <summary>
    /// Gets or sets the number field error text.
    /// </summary>
    [Parameter]
    public string? ErrorText { get; set; }

    /// <summary>
    /// Gets or sets whether the number field error is visible.
    /// </summary>
    [Parameter]
    public bool? ErrorVisible { get; set; }

    /// <summary>
    /// Gets or sets the child content to be rendered inside the combobox
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}
