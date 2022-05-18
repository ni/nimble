using Microsoft.AspNetCore.Components;

namespace NimbleBlazor.Demo.Shared
{
    /// <summary>
    /// The NavigationDrawer Component.
    /// </summary>
    public partial class NavigationDrawer
    {
        private bool _isDrawerPinned = false;
        private DrawerState? _state = DrawerState.Closed;

        [Parameter]
        public DrawerLocation Location { get; set; } = DrawerLocation.Right;

        [Parameter]
        public RenderFragment? ChildContent { get; set; }

        private string PinnedCssClass => _isDrawerPinned ? "pinned" : string.Empty;

        private string LocationRightCssClass => Location == DrawerLocation.Right ? "location-right" : string.Empty;

        public void Open()
        {
            _state = DrawerState.Opening;
        }

        public void TogglePinned()
        {
            _isDrawerPinned = !_isDrawerPinned;
            _state = _isDrawerPinned ? DrawerState.Opened : DrawerState.Closed;
        }
    }
}