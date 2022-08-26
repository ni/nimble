using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace NimbleBlazor;

public partial class NimbleDialog<TCloseReason> : ComponentBase
{
    private ElementReference _dialogElement;
    private TCloseReason? _closeValue = default;

    internal static string ShowDialogMethodName = "NimbleBlazor.Dialog.show";
    internal static string CloseDialogMethodName = "NimbleBlazor.Dialog.close";

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter]
    public bool? PreventDismiss { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    [Inject]
    private IJSRuntime? JSRuntime { get; set; }

    /// <summary>
    /// Show/Open the dialog.
    /// </summary>
    public async ValueTask<DialogResponse<TCloseReason>> ShowAsync()
    {
        // Pass cancellation token to disable default async timeout
        CancellationTokenSource source = new CancellationTokenSource();
        CancellationToken token = source.Token;
        var userDismissed = await JSRuntime!.InvokeAsync<bool>(ShowDialogMethodName, token, _dialogElement);
        return new DialogResponse<TCloseReason>(userDismissed ? DialogCloseReason.UserDismissed : DialogCloseReason.Closed, _closeValue);
    }

    /// <summary>
    /// Hide/Close the dialog.
    /// </summary>
    /// <param name="reason">Optional reason for closing the dialog</param>
    public async Task CloseAsync(TCloseReason? reason = default)
    {
        _closeValue = reason;
        await JSRuntime!.InvokeVoidAsync(CloseDialogMethodName, _dialogElement);
    }
}
