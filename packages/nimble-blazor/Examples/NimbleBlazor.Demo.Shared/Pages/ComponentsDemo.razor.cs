using NimbleBlazor.Components;

namespace NimbleBlazor.Demo.Shared.Pages
{
    /// <summary>
    /// The components demo page
    /// </summary>
    public partial class ComponentsDemo
    {
        private NavigationDrawer? _navigationDrawer;
        private DrawerLocation _drawerLocation = DrawerLocation.Right;
#pragma warning disable CA1823 // Field used in Razor file
        private string? _activeTabId;
#pragma warning restore CA1823

        private string DrawerLocationAsString
        {
            get => _drawerLocation.ToString();
            set => _drawerLocation = (DrawerLocation)Enum.Parse(typeof(DrawerLocation), value);
        }

        public void OpenDrawer()
        {
            _navigationDrawer!.Open();
        }

        public void DrawerTogglePinned()
        {
            _navigationDrawer!.TogglePinned();
        }
    }
}
