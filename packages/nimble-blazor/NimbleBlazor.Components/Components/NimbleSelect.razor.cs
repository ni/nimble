﻿using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor.Components;

public partial class NimbleSelect : NimbleInputBase<string?>
{
    private readonly string _defaultSelectName = Guid.NewGuid().ToString("N", null);
    private NimbleOptionContext? _context;

    /// <summary>
    /// Gets or sets the name of the Select.
    /// </summary>
    [Parameter]
    public string? Name { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public Position? Position { get; set; }

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
