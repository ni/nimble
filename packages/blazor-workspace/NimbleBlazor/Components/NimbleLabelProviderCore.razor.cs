﻿using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

/// <summary>
/// Core Label Provider for Nimble
/// </summary>
public partial class NimbleLabelProviderCore : ComponentBase
{
    [Parameter]
    public string? PopupDismiss { get; set; }

    [Parameter]
    public string? NumericIncrement { get; set; }

    [Parameter]
    public string? NumericDecrement { get; set; }

    [Parameter]
    public string? PopupIconError { get; set; }

    [Parameter]
    public string? PopupIconWarning { get; set; }

    [Parameter]
    public string? PopupIconInformation { get; set; }

    [Parameter]
    public string? FilterSearch { get; set; }

    [Parameter]
    public string? FilterNoResults { get; set; }

    [Parameter]
    public string? Loading { get; set; }

    [Parameter]
    public string? ScrollBackward { get; set; }

    [Parameter]
    public string? ScrollForward { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
