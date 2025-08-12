using Microsoft.AspNetCore.Components;

namespace SprightBlazor;

public class ChatInputSendEventArgs : EventArgs
{
    public string Text { get; set; } = string.Empty;
}

[EventHandler("onsprightchatinputsend", typeof(ChatInputSendEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
public static class EventHandlers
{
}
