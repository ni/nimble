﻿using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleSelect : NimbleInputBase<string?>
{
    private readonly string _defaultSelectName = Guid.NewGuid().ToString("N", null);
    private NimbleOptionContext? _context;

    /// <summary>
    /// Gets or sets the name of the Select.
    /// </summary>
    [Parameter]
    public string? Name { get; set; }

    /// <summary>
    /// Gets or sets the disabled state of the select.
    /// </summary>
    [Parameter]
    public bool? Disabled { get; set; }

    /// <summary>
    /// Gets or sets the select dropdown position.
    /// </summary>
    [Parameter]
    public Position? Position { get; set; }

    /// <summary>
    /// Gets or sets the select appearance <see cref="DropdownAppearance"/>.
    /// </summary>
    [Parameter]
    public DropdownAppearance? Appearance { get; set; }

    /// <summary>
    /// Gets or sets the select filter mode.
    /// </summary>
    [Parameter]
    public FilterMode? FilterMode { get; set; }

    /// <summary>
    /// Gets or sets whether the select can be cleared.
    /// </summary>
    [Parameter]
    public bool? Clearable { get; set; }

    /// <summary>
    /// Gets or sets the select error text
    /// </summary>
    [Parameter]
    public string? ErrorText { get; set; }

    /// <summary>
    /// Gets or sets whether the select error is visible
    /// </summary>
    [Parameter]
    public bool? ErrorVisible { get; set; }

    /// <summary>
    /// Gets or sets whether the select's required indicator is visible
    /// </summary>
    [Parameter]
    public bool? RequiredVisible { get; set; }

    /// <summary>
    /// Gets or set whether or not the select should be rendered as
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
    /// Gets or sets the child content to be rendering inside the <see cref="NimbleSelect"/>.
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
