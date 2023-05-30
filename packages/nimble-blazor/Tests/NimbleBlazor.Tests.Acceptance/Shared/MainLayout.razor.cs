using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using NimbleBlazor;

namespace NimbleBlazor.Tests.Acceptance.Shared
{
    /// <summary>
    /// The MainLayout Component.
    /// </summary>
    public partial class MainLayout
    {
        private Theme Theme { get; set; } = Theme.Light;

        public ErrorBoundary? ErrorBoundary { get; set; }

        [Inject]
        public IJSRuntime? JSRuntime { get; set; }

        protected override void OnParametersSet()
        {
            ErrorBoundary?.Recover();
        }
    }
}