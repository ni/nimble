using NimbleBlazor;
using OkBlazor;

namespace Demo.Shared.Pages.Sections;

public partial class TsBreakpointTableSection
{
    private NimbleTable<BreakpointTableRecord>? _table;

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
        record?.BreakpointState = e.NewState;
        StateHasChanged();
    }

    private void OnBreakpointStateChangeRequested(BreakpointColumnStateChangeRequestedEventArgs e)
    {
        var record = _tableData.FirstOrDefault(r => r.Id == e.RecordId);
        record?.BreakpointState = e.RequestedState;

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
