using System.Globalization;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public class TabsChangeEventArgs : EventArgs
{
    public string? ActiveId { get; set; }
}

public class CheckboxChangeEventArgs : EventArgs
{
    public bool Checked { get; set; }
}

public class MenuButtonOpenChangeEventArgs : EventArgs
{
    public bool Open { get; set; }
}

public class MenuButtonBeforeToggleEventArgs : EventArgs
{
    public bool NewState { get; set; }
    public bool OldState { get; set; }
}

[EventHandler("onnimbletabsactiveidchange", typeof(TabsChangeEventArgs), enableStopPropagation: true, enablePreventDefault: true)]
[EventHandler("onnimblecheckedchange", typeof(CheckboxChangeEventArgs), enableStopPropagation: true, enablePreventDefault: true)]
[EventHandler("onnimblemenubuttonopenchange", typeof(MenuButtonOpenChangeEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onnimblemenubuttonbeforetoggle", typeof(MenuButtonBeforeToggleEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
public static class EventHandlers
{
}
