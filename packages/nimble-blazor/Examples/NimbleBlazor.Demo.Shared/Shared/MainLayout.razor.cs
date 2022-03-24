using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace NimbleBlazor.Demo.Shared
{
    public partial class MainLayout
    {
        [Inject] IJSRuntime? JSRuntime { get; set; }

        ErrorBoundary? errorBoundary;

        protected override void OnParametersSet()
        {
            errorBoundary?.Recover();
        }
    }
}