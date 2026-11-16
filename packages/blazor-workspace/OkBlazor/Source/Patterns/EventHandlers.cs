using Microsoft.AspNetCore.Components;

namespace OkBlazor;

[EventHandler("onokbreakpointcolumntoggle", typeof(BreakpointColumnToggleEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokbreakpointcolumnstatechangerequested", typeof(BreakpointColumnStateChangeRequestedEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfvmultiselectinput", typeof(FvMultiSelectEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfveditfilter", typeof(FvFilterBarEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfvclearfilter", typeof(FvFilterBarEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfvsave", typeof(EventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfvrevert", typeof(EventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfvdismissmessage", typeof(EventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfvreset", typeof(EventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfvclear", typeof(EventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfvedititems", typeof(EventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfvtrigger", typeof(EventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfvtoggle", typeof(FvToggleEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfvchipchange", typeof(FvMultiSelectEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfvlistchange", typeof(FvListChangeEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfvpositioninput", typeof(FvPositionEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
[EventHandler("onokfvpositionchange", typeof(FvPositionEventArgs), enableStopPropagation: true, enablePreventDefault: false)]
public static class EventHandlers
{
}
