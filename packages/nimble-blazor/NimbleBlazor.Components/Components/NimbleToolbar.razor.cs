using Microsoft.AspNetCore.Components;

namespace NimbleBlazor.Components;

public partial class NimbleToolbar
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}