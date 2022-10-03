using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace NimbleBlazor;

public partial class NimbleDialog<TCloseReason> : ComponentBase
{
    private ElementReference _dialogElement;
    private TCloseReason? _closeValue = default;

    internal static string ShowDialogMethodName = "NimbleBlazor.Dialog.show";
    internal static string CloseDialogMethodName = "NimbleBlazor.Dialog.close";

    /// <summary>
    /// Gets or sets the child content to be rendered inside the dialog.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets whether or not the dialog is dismissible via the Esc key.
    /// </summary>
    [Parameter]
    public bool? PreventDismiss { get; set; }

    /// <summary>
    /// Gets or sets whether or not the header of the dialog is hidden. Setting the value to true hides the
    /// title and subtitle of the dialog and allows the main content of the dialog to fill the space that would
    /// otherwise be reserved for the header. A title (and optionally a subtitle) should still be provided when
    /// the value is set to true to ensure the dialog has a label that can be used by assistive technologies.
    /// </summary>
    [Parameter]
    public bool? HeaderHidden { get; set; }

    /// <summary>
    /// Gets or sets whether or not the footer of the dialog is hidden. Setting the value to true hides the
    /// footer and any content that has been slotted within it. Setting the value to true also allows the
    /// main content of the dialog to fill the space that would otherwise be reserved for the footer.
    /// </summary>
    [Parameter]
    public bool? FooterHidden { get; set; }

    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
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
        var value = _closeValue;
        _closeValue = default;
        return new DialogResponse<TCloseReason>(userDismissed ? DialogCloseReason.UserDismissed : DialogCloseReason.Closed, value);
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
