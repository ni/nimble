using NimbleBlazor;

namespace Demo.Shared.Pages
{
    /// <summary>
    /// The components demo page
    /// </summary>
    public partial class ComponentsDemo
    {
        private NavigationDrawer? _navigationDrawer;
        private DrawerLocation _drawerLocation = DrawerLocation.Right;
        private string? ActiveTabId { get; set; }
        private NimbleDialog? _dialog;
        private string? ClosedReason { get; set; }

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

        public async Task OpenDialogAsync()
        {
            ClosedReason = await _dialog!.ShowAsync();
        }

        public async Task CloseDialogAsync(string reason = "")
        {
            await _dialog!.CloseAsync(reason);
        }
    }
}
