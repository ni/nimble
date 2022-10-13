using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace NimbleBlazor;

public partial class NimbleDrawer<TCloseReason> : ComponentBase
{
    private ElementReference _drawerElement;
    private TCloseReason? _closeValue = default;

    internal static string ShowDrawerMethodName = "NimbleBlazor.Drawer.show";
    internal static string CloseDrawerMethodName = "NimbleBlazor.Drawer.close";

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter]
    public DrawerLocation? Location { get; set; }

    [Parameter]
    public bool? PreventDismiss { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject]
    private IJSRuntime? JSRuntime { get; set; }

    /// <summary>
    /// Show/Open the drawer.
    /// </summary>
    public async ValueTask<DrawerResponse<TCloseReason>> ShowAsync()
    {
        // Pass cancellation token to disable default async timeout
        CancellationTokenSource source = new CancellationTokenSource();
        CancellationToken token = source.Token;
        var userDismissed = await JSRuntime!.InvokeAsync<bool>(ShowDrawerMethodName, token, _drawerElement);
        var value = _closeValue;
        _closeValue = default;
        return new DrawerResponse<TCloseReason>(userDismissed ? DrawerCloseReason.UserDismissed : DrawerCloseReason.Closed, value);
    }

    /// <summary>
    /// Hide/Close the drawer.
    /// </summary>
    /// <param name="reason">Optional reason for closing the drawer</param>
    public async Task CloseAsync(TCloseReason? reason = default)
    {
        _closeValue = reason;
        await JSRuntime!.InvokeVoidAsync(CloseDrawerMethodName, _drawerElement);
    }
}
