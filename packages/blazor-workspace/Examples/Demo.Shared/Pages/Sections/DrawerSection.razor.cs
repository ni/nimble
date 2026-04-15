using NimbleBlazor;

namespace Demo.Shared.Pages.Sections;

public partial class DrawerSection
{
    private DrawerLocation _drawerLocation = DrawerLocation.Right;
    private NimbleDrawer<DialogResult>? _drawer;
    private string? DrawerClosedReason { get; set; }

    private string DrawerLocationAsString
    {
        get => _drawerLocation.ToString();
        set => _drawerLocation = Enum.Parse<DrawerLocation>(value);
    }

    public async Task OpenDrawerAsync()
    {
        var response = await _drawer!.ShowAsync();
        DrawerClosedReason = response.Reason == DrawerCloseReason.UserDismissed ? "User dismissed"
                                                                          : response.Value.ToString();
    }

    public async Task CloseDrawerAsync(DialogResult reason)
    {
        await _drawer!.CloseAsync(reason);
    }
}
