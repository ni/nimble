using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleSpinner : ComponentBase
{
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
