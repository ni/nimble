using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleToolbar
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}