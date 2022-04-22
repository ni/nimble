using Microsoft.AspNetCore.Components;

namespace NimbleBlazor.Components;

public class CheckboxChangeEventArgs : EventArgs
{
    public bool Checked { get; set; }
}

[EventHandler("onnimblecheckedchange", typeof(CheckboxChangeEventArgs), enableStopPropagation: true, enablePreventDefault: true)]
public static class EventHandlers
{
}
