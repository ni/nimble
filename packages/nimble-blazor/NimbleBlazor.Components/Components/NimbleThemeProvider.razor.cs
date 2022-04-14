using Microsoft.AspNetCore.Components;

namespace NimbleBlazor.Components;

public partial class NimbleThemeProvider : ComponentBase
{
    [Parameter]
    public Direction? Direction { get; set; }

    [Parameter]
    public Theme? Theme { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}
