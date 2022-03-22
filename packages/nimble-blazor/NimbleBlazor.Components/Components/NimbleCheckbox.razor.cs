﻿using Microsoft.AspNetCore.Components;
using System.Diagnostics.CodeAnalysis;

namespace NimbleBlazor.Components;

public partial class NimbleCheckbox : NimbleInputBase<bool>
{
    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? Required { get; set; }

    [Parameter]
    public bool? Readonly { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    protected override bool TryParseValueFromString(string? value, [MaybeNullWhen(false)] out bool result, [NotNullWhen(false)] out string? validationErrorMessage) => throw new NotSupportedException($"This component does not parse string inputs. Bind to the '{nameof(CurrentValue)}' property, not '{nameof(CurrentValueAsString)}'.");
}
