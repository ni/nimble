using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleChip : ComponentBase
{
    [Parameter]
    public bool? Removable { get; set; }

    [Parameter]
    public bool? Disabled { get; set; }

    [Parameter]
    public ChipAppearance? Appearance { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
