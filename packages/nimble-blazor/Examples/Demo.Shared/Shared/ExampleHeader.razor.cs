using Microsoft.AspNetCore.Components;
using NimbleBlazor;

namespace Demo.Shared
{
    /// <summary>
    /// The ExampleHeader Component.
    /// </summary>
    public partial class ExampleHeader
    {
        private NimbleDrawer? _drawerReference;

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

        private void OnUserSettingsSelected()
        {
            _drawerReference!.Show();
        }

        private void OnCloseButtonClicked()
        {
            _drawerReference!.Hide();
        }
    }
}