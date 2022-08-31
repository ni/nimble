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
    public DialogCloseReason Reason { get; private set; }
    /* When Reason is Closed, this is the value that was passed to the Close() function. */
    public TCloseReason? Value { get; private set; }

    public DialogResponse(DialogCloseReason reason, TCloseReason? value)
    {
        Reason = reason;
        Value = value;
    }
}