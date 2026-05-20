using NimbleBlazor;

namespace Demo.Shared.Pages.Sections;

public partial class DialogSection
{
    private NimbleDialog<DialogResult>? _dialog;
    private string? DialogClosedReason { get; set; }

    public async Task OpenDialogAsync()
    {
        var response = await _dialog!.ShowAsync();
        DialogClosedReason = response.Reason == DialogCloseReason.UserDismissed ? "User dismissed"
                                                                          : response.Value.ToString();
    }

    public async Task CloseDialogAsync(DialogResult reason)
    {
        await _dialog!.CloseAsync(reason);
    }
}
