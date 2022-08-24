namespace NimbleBlazor;

public class DialogResponse<TCloseReason>
{
    public readonly TCloseReason CloseReason;
    public readonly bool UserDismissed;

    public DialogResponse(TCloseReason closeReason, bool userDismissed)
    {
        CloseReason = closeReason;
        UserDismissed = userDismissed;
    }
}