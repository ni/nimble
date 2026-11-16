using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvMasterDetailList : ComponentBase
{
    [Parameter]
    public EventCallback<FvListChangeEventArgs> SelectionChanged { get; set; }

    [Parameter]
    public string? Placeholder { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
