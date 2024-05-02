using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;
public abstract class NimbleListOptionBase<TOption> : ComponentBase
{
    [CascadingParameter(Name = "ListContext")]
    internal InternalListContext<TOption> InternalListContext { get; set; } = default!;

    public void Dispose() => InternalListContext.Unregister(this);
}
