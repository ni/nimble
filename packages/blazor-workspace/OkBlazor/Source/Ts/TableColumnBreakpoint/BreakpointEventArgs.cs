namespace OkBlazor;

/// <summary>
/// The possible states of a breakpoint indicator.
/// </summary>
public static class BreakpointState
{
    public const string Off = "off";
    public const string Enabled = "enabled";
    public const string Disabled = "disabled";
    public const string Hit = "hit";
    public const string Conditional = "conditional";
    public const string HitDisabled = "hit-disabled";
}

/// <summary>
/// Event args for the breakpoint-column-toggle event.
/// </summary>
public class BreakpointColumnToggleEventArgs : EventArgs
{
    public string RecordId { get; set; } = string.Empty;
    public string NewState { get; set; } = string.Empty;
    public string OldState { get; set; } = string.Empty;
}

/// <summary>
/// Event args for the breakpoint-column-context-menu event.
/// </summary>
public class BreakpointColumnContextMenuEventArgs : EventArgs
{
    public string RecordId { get; set; } = string.Empty;
    public string CurrentState { get; set; } = string.Empty;
}
