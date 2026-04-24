namespace NimbleBlazor;

public enum DrawerCloseReason
{
    /* Drawer was programmatically closed e.g. NimbleDrawer.Close() called */
    Closed,
    /* User dismissed via ESC keypress */
    UserDismissed
}

public class DrawerResponse<TCloseReason>
{
    public DrawerCloseReason Reason { get; private set; }
    /* When Reason is Closed, this is the value that was passed to the Close() function. */
    public TCloseReason? Value { get; private set; }

    public DrawerResponse(DrawerCloseReason reason, TCloseReason? value)
    {
        Reason = reason;
        Value = value;
    }
}