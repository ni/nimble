using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleBreadcrumbItem : ComponentBase
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    [Parameter]
    public string? Href { get; set; }

    [Parameter]
    public string? HrefLang { get; set; }

    [Parameter]
    public string? Ping { get; set; }

    [Parameter]
    public string? ReferrerPolicy { get; set; }

    [Parameter]
    public string? Rel { get; set; }

    [Parameter]
    public string? Target { get; set; }

    [Parameter]
    public string? Type { get; set; }
}
