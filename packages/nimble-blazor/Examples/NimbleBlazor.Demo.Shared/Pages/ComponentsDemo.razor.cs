using NimbleBlazor.Components;

namespace NimbleBlazor.Demo.Shared.Pages
{
    /// <summary>
    /// The components demo page
    /// </summary>
    public partial class ComponentsDemo
    {
        private NavigationDrawer? _navigationDrawer;
        private string? _activeTabId;
        private DrawerLocation _drawerLocation = DrawerLocation.Right;

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
