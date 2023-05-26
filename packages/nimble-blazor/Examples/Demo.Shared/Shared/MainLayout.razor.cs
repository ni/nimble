using Demo.Shared.Pages;
using Demo.Shared.Resources;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.Localization;
using Microsoft.JSInterop;
using NimbleBlazor;

namespace Demo.Shared
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

        [Inject]
        internal IStringLocalizer<NimbleLabels>? LabelProvider { get; set; }

        protected override void OnParametersSet()
        {
            ErrorBoundary?.Recover();
        }
    }
}