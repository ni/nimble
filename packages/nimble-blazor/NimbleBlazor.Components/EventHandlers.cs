using System.Globalization;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor.Components;

public class DrawerStateChangeEventArgs : EventArgs
{
    public string? State { get; set; }

    public DrawerState DrawerState
    {
        get
        {
            var drawerState = CultureInfo.InvariantCulture.TextInfo.ToTitleCase(State!);
            return (DrawerState)Enum.Parse(typeof(DrawerState), drawerState);
        }
    }
}

public class TabsChangeEventArgs : EventArgs
{
    public string? ActiveId { get; set; }
}

public class CheckboxChangeEventArgs : EventArgs
{
    public bool Checked { get; set; }
}

[EventHandler("onnimbledrawerstatechange", typeof(DrawerStateChangeEventArgs), enableStopPropagation: true, enablePreventDefault: true)]
[EventHandler("onnimbletabsactiveidchange", typeof(TabsChangeEventArgs), enableStopPropagation: true, enablePreventDefault: true)]
[EventHandler("onnimblecheckedchange", typeof(CheckboxChangeEventArgs), enableStopPropagation: true, enablePreventDefault: true)]
public static class EventHandlers
{
}
