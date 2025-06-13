using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleCombobox : NimbleInputBase<string?>
{
    private readonly string _defaultSelectName = Guid.NewGuid().ToString("N", null);
    private NimbleOptionContext? _context;

    /// <summary>
    /// Gets or sets the name of the combobox.
    /// </summary>
    /// <remarks>This is used to help provide the context for the contained NimbleListOptions</remarks>
    [Parameter]
    public string? Name { get; set; }

    /// <summary>
    /// Gets or sets whether the combobox is disabled
    /// </summary>
    [Parameter]
    public bool? Disabled { get; set; }

    /// <summary>
    /// Gets or sets the position of the popup relative to the combobox
    /// </summary>
    [Parameter]
    public Position? Position { get; set; }

    /// <summary>
    /// Gets or sets the appearance of the combobox
    /// </summary>
    [Parameter]
    public DropdownAppearance? Appearance { get; set; }

    /// <summary>
    /// Gets or sets the autocomplete mode for the combobox
    /// </summary>
    [Parameter]
    public AutoComplete? AutoComplete { get; set; }

    /// <summary>
    /// Gets or sets the placeholder for the combobox
    /// </summary>
    [Parameter]
    public string? Placeholder { get; set; }

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

    /// <summary>
    /// Gets or sets whether the combobox's required indicator is visible
    /// </summary>
    [Parameter]
    public bool? RequiredVisible { get; set; }

    /// <summary>
    /// Gets or set whether or not the combobox should be rendered as
    /// read only when it is disabled.
    /// </summary>
    [Parameter]
    public bool? AppearanceReadOnly { get; set; }

    /// <summary>
    /// Gets or set whether or not the start and end margins of the control are removed.
    /// This only applies when the <see cref="Appearance"/> is <see cref="DropdownAppearance.Frameless"/>.
    /// </summary>
    [Parameter]
    public bool? FullBleed { get; set; }

    /// <summary>
    /// Gets or sets the child content to be rendered inside the combobox
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [CascadingParameter]
    private NimbleOptionContext? CascadedContext { get; set; }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        var selectName = !string.IsNullOrEmpty(Name) ? Name : _defaultSelectName;
        var fieldClass = string.Empty;
        var changeEventCallback = EventCallback.Factory.CreateBinder<string?>(this, value => CurrentValueAsString = value, CurrentValueAsString);
        _context = new NimbleOptionContext(CascadedContext, selectName, CurrentValue, fieldClass, changeEventCallback);
    }

    protected override bool TryParseValueFromString(string? value, out string? result, [NotNullWhen(false)] out string? validationErrorMessage)
    {
        result = value;
        validationErrorMessage = null;
        return true;
    }
}
