using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace NimbleBlazor;

public partial class NimbleDialog : ComponentBase
{
    private ElementReference _dialogElement;

    internal static string ShowDialogMethodName = "showDialog";
    internal static string CloseDialogMethodName = "closeDialog";

    public const string UserDismissed = "USER_DISMISSED";

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
    public async ValueTask<string> ShowAsync()
    {
        if (JSRuntime is not null)
        {
            return await JSRuntime.InvokeAsync<string>(ShowDialogMethodName, _dialogElement);
        }

        return string.Empty;
    }

    /// <summary>
    /// Hide/Close the dialog.
    /// </summary>
    /// <param name="reason">Optional reason for closing the dialog</param>
    public async Task CloseAsync(string reason = "")
    {
        if (JSRuntime is not null)
        {
            await JSRuntime.InvokeVoidAsync(CloseDialogMethodName, _dialogElement, reason);
        }
    }
}
