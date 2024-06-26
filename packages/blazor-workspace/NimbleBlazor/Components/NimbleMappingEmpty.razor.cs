﻿using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleMappingEmpty<TKey> : NimbleMappingBase<TKey>
{
    /// <summary>
    /// Gets or sets text for the mapped value.
    /// </summary>
    [Parameter]
    public string? Text { get; set; }
}
