using Microsoft.AspNetCore.Components;

namespace OkBlazor;

[EventHandler("onokbreakpointcolumntoggle", typeof(BreakpointColumnToggleEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokbreakpointcolumncontextmenu", typeof(BreakpointColumnContextMenuEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
public static class EventHandlers
{
}
