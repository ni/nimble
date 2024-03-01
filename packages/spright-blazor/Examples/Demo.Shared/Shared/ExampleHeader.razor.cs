using Microsoft.AspNetCore.Components;
using NimbleBlazor;

namespace Demo.Shared
{
    /// <summary>
    /// The ExampleHeader Component.
    /// </summary>
    public partial class ExampleHeader
    {
        private NimbleDrawer<string>? _drawerReference;

        [Parameter]
        public Theme Theme { get; set; }

        [Parameter]
        public EventCallback<Theme> ThemeChanged { get; set; }

        private string ThemeAsString
        {
            get => Theme.ToString();
            set => Theme = (Theme)Enum.Parse(typeof(Theme), value);
        }

        private async void OnUserThemeChange(string newTheme)
        {
            ThemeAsString = newTheme;
            await ThemeChanged.InvokeAsync(Theme);
        }

        private async void OnUserSettingsSelected()
        {
            await _drawerReference!.ShowAsync();
        }

        private async void OnCloseButtonClicked()
        {
            await _drawerReference!.CloseAsync();
        }
    }
}