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
    /// Gets or sets the autocomplete mode for the combobox
    /// </summary>
    [Parameter]
    public AutoComplete? AutoComplete { get; set; }

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
