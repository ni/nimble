using NimbleBlazor;
using OkBlazor;

namespace Demo.Shared.Pages.Sections;

public partial class TsBreakpointTableSection
{
    private NimbleTable<BreakpointTableRecord>? _table;
    private bool _contextMenuOpen;
    private double _menuX;
    private double _menuY;
    private string? _contextMenuRecordId;
    private string _contextMenuRecordState = BreakpointState.Off;
    private string _lastEvent = "(none)";

    private string ContextMenuStyle => $"position: fixed; left: {_menuX}px; top: {_menuY}px; z-index: 2147483647;";

    private List<BreakpointTableRecord> _tableData = new()
    {
        new("1", null, "Main.cs", 12, BreakpointState.Enabled),
        new("2", "1", "Helper.cs", 45, BreakpointState.Off),
        new("3", "1", "Service.cs", 78, BreakpointState.Disabled),
        new("4", null, "Controller.cs", 23, BreakpointState.Hit),
        new("5", "4", "Model.cs", 91, BreakpointState.Conditional),
        new("6", null, "Startup.cs", 5, BreakpointState.HitDisabled),
        new("7", "6", "Program.cs", 1, BreakpointState.Off),
    };

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await _table!.SetDataAsync(_tableData);
        await base.OnAfterRenderAsync(firstRender);
    }

    private void OnBreakpointToggle(BreakpointColumnToggleEventArgs e)
    {
        var record = _tableData.FirstOrDefault(r => r.Id == e.RecordId);
        if (record != null)
        {
            record.BreakpointState = e.NewState;
        }
        _lastEvent = $"Toggle: record={e.RecordId}, {e.OldState} -> {e.NewState}";
        StateHasChanged();
    }

    private void OnBreakpointContextMenu(BreakpointColumnContextMenuEventArgs e)
    {
        _contextMenuRecordId = e.RecordId;
        _contextMenuRecordState = e.CurrentState;
        _menuX = e.AnchorX;
        _menuY = e.AnchorY;
        _contextMenuOpen = true;
        _lastEvent = $"ContextMenu: record={e.RecordId}, state={e.CurrentState}, x={e.AnchorX}, y={e.AnchorY}";
        StateHasChanged();
    }

    private void OnAddBreakpoint()
    {
        CloseContextMenuAndSetState(BreakpointState.Enabled);
    }

    private void OnAddConditionalBreakpoint()
    {
        CloseContextMenuAndSetState(BreakpointState.Conditional);
    }

    private void OnRemoveBreakpoint()
    {
        CloseContextMenuAndSetState(BreakpointState.Off);
    }

    private void OnDisableBreakpoint()
    {
        CloseContextMenuAndSetState(BreakpointState.Disabled);
    }

    private void OnEnableBreakpoint()
    {
        CloseContextMenuAndSetState(BreakpointState.Enabled);
    }

    private void CloseContextMenu()
    {
        _contextMenuOpen = false;
        StateHasChanged();
    }

    private void CloseContextMenuAndSetState(string newState)
    {
        _contextMenuOpen = false;
        SetRecordState(newState);
    }

    private void SetRecordState(string newState)
    {
        var record = _tableData.FirstOrDefault(r => r.Id == _contextMenuRecordId);
        if (record != null)
        {
            record.BreakpointState = newState;
        }
        StateHasChanged();
    }
}

public class BreakpointTableRecord
{
    public BreakpointTableRecord(string id, string? parentId, string name, int lineNumber, string breakpointState)
    {
        Id = id;
        ParentId = parentId;
        Name = name;
        LineNumber = lineNumber;
        BreakpointState = breakpointState;
    }

    public string Id { get; set; }
    public string? ParentId { get; set; }
    public string Name { get; set; }
    public int LineNumber { get; set; }
    public string BreakpointState { get; set; }
}
