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

public class MenuButtonToggleEventArgs : EventArgs
{
    public bool NewState { get; set; }
    public bool OldState { get; set; }
}

public class TableActionMenuToggleEventArgs : EventArgs
{
    public bool NewState { get; set; }
    public bool OldState { get; set; }
    public IEnumerable<string>? RecordIds { get; set; }
    public NimbleTableColumnText? ColumnTarget { get; set; }
}

[EventHandler("onnimbletabsactiveidchange", typeof(TabsChangeEventArgs), enableStopPropagation: true, enablePreventDefault: true)]
[EventHandler("onnimblecheckedchange", typeof(CheckboxChangeEventArgs), enableStopPropagation: true, enablePreventDefault: true)]
[EventHandler("onnimblemenubuttontoggle", typeof(MenuButtonToggleEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onnimblemenubuttonbeforetoggle", typeof(MenuButtonToggleEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onnimbleactionmenutoggle", typeof(TableActionMenuToggleEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onnimbleactionmenubeforetoggle", typeof(TableActionMenuToggleEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
public static class EventHandlers
{
}
