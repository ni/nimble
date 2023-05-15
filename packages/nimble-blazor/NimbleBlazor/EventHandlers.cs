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

public class BannerToggleEventArgs : EventArgs
{
    public bool OldState { get; set; }
    public bool NewState { get; set; }
}

public class TableActionMenuToggleEventArgs : EventArgs
{
    public bool NewState { get; set; }
    public bool OldState { get; set; }
    public IEnumerable<string>? RecordIds { get; set; }
    public string? ColumnId { get; set; }
}

public class TableRowSelectionEventArgs : EventArgs
{
    public IEnumerable<string>? SelectedRecordIds { get; set; }
}

public class TableColumnConfigurationEventArgs : EventArgs
{
    public IEnumerable<TableColumnConfiguration>? Columns { get; set; }
}

public class TableColumnConfiguration
{
    public string? ColumnId { get; set; }
    public int? SortIndex { get; set; }
    public TableColumnSortDirection SortDirection { get; set; }
    public int? GroupIndex { get; set; }
    public bool Hidden { get; set; }
    public double FractionalWidth { get; set; }
    public double? PixelWidth { get; set; }
}

[EventHandler("onnimbletabsactiveidchange", typeof(TabsChangeEventArgs), enableStopPropagation: true, enablePreventDefault: true)]
[EventHandler("onnimblecheckedchange", typeof(CheckboxChangeEventArgs), enableStopPropagation: true, enablePreventDefault: true)]
[EventHandler("onnimblemenubuttontoggle", typeof(MenuButtonToggleEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onnimblemenubuttonbeforetoggle", typeof(MenuButtonToggleEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onnimblebannertoggle", typeof(BannerToggleEventArgs), enableStopPropagation: true, enablePreventDefault: true)]
[EventHandler("onnimbleactionmenutoggle", typeof(TableActionMenuToggleEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onnimbleactionmenubeforetoggle", typeof(TableActionMenuToggleEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onnimbletablerowselectionchange", typeof(TableRowSelectionEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onnimbletablecolumnconfigurationchange", typeof(TableColumnConfigurationEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
public static class EventHandlers
{
}
