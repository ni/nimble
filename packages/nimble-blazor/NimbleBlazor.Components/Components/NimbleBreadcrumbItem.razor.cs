using Microsoft.AspNetCore.Components;

namespace NimbleBlazor.Components;

public partial class NimbleBreadcrumbItem : ComponentBase
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "NI1704:Identifiers should be spelled correctly", Justification = "Matching spelling of HTMLAnchorElement.href")]
    [Parameter]
    public string? Href { get; set; }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "NI1704:Identifiers should be spelled correctly", Justification = "Matching spelling of HTMLAnchorElement.hreflang")]
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
