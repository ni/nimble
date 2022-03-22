﻿using Microsoft.AspNetCore.Components;

namespace NimbleBlazor.Components;

public partial class NimbleMenuItem
{
    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public bool? Checked { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
