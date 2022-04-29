using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using NimbleBlazor.Components;

namespace NimbleBlazor.Demo.Shared
{
    /// <summary>
    /// The MainLayout Component.
    /// </summary>
    public partial class MainLayout
    {
#pragma warning disable CA1823 // Field used in Razor file
        private Theme _theme = Theme.Light;
#pragma warning restore CA1823

        public ErrorBoundary? ErrorBoundary { get; set; }

        [Inject]
        public IJSRuntime? JSRuntime { get; set; }

        protected override void OnParametersSet()
        {
            ErrorBoundary?.Recover();
        }
    }
}