namespace NimbleBlazor;

public enum DialogCloseReason
{
    /* Dialog was programmatically closed e.g. NimbleDialog.Close() called */
    Closed,
    /* User dismissed via ESC keypress */
    UserDismissed
}

public class DialogResponse<TCloseReason>
{
    public readonly DialogCloseReason Reason;
    /* When Reason is Closed, this is the value that was passed to the Close() function. */
    public readonly TCloseReason? Value;

    public DialogResponse(DialogCloseReason reason, TCloseReason? value)
    {
        Reason = reason;
        Value = value;
    }
}