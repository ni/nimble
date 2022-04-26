using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace NimbleBlazor.Demo.Shared
{
    /// <summary>
    /// The MainLayout Component.
    /// </summary>
    public partial class MainLayout
    {
        public ErrorBoundary? ErrorBoundary { get; set; }

        [Inject]
        public IJSRuntime? JSRuntime { get; set; }

        protected override void OnParametersSet()
        {
            ErrorBoundary?.Recover();
        }
    }
}