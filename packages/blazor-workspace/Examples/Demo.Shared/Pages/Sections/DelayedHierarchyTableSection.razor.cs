using NimbleBlazor;

namespace Demo.Shared.Pages.Sections;

public partial class DelayedHierarchyTableSection
{
    private NimbleTable<PersonTableRecord>? _delayedHierarchyTable;
    private readonly List<PersonTableRecord> _delayedHierarchyTableData = new()
    {
        new PersonTableRecord("jacqueline-bouvier", null, "Jacqueline", "Bouvier", 80, true),
        new PersonTableRecord("mona-simpson", null, "Mona", "Simpson", 77, true),
        new PersonTableRecord("agnes-skinner", null, "Agnes", "Skinner", 88, true)
    };
    private readonly HashSet<string> _recordsLoadingChildren = new();
    private readonly HashSet<string> _recordsWithLoadedChildren = new();

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await UpdateDelayedHierarchyTableAsync();
        await base.OnAfterRenderAsync(firstRender);
    }

    private async Task OnRowExpandToggleAsync(TableRowExpandToggleEventArgs e)
    {
        var recordId = e.RecordId;
        if (e.NewState && !_recordsLoadingChildren.Contains(recordId) && !_recordsWithLoadedChildren.Contains(recordId))
        {
            var record = _delayedHierarchyTableData.Find(person => person.Id == recordId);
            if (record == null)
            {
                return;
            }

            _recordsLoadingChildren.Add(recordId);
            await UpdateDelayedHierarchyTableAsync(false);

            await Task.Delay(1500);
            _recordsLoadingChildren.Remove(recordId);
            _recordsWithLoadedChildren.Add(recordId);
            var childrenToAdd = GetChildren(recordId);
            childrenToAdd.ForEach(child => _delayedHierarchyTableData.Add(child));
            await UpdateDelayedHierarchyTableAsync();
        }
    }

    private List<PersonTableRecord> GetChildren(string recordId)
    {
        switch (recordId)
        {
            case "jacqueline-bouvier":
                return new List<PersonTableRecord>()
                {
                    new PersonTableRecord("marge-simpson", recordId, "Marge", "Simpson", 35, true),
                    new PersonTableRecord("selma-bouvier", recordId, "Selma", "Bouvier", 45, false),
                    new PersonTableRecord("patty-bouvier", recordId, "Patty", "Bouvier", 45, false)
                };
            case "marge-simpson":
                return new List<PersonTableRecord>()
                {
                    new PersonTableRecord("bart-simpson", recordId, "Bart", "Simpson", 12, false),
                    new PersonTableRecord("lisa-bouvier", recordId, "Lisa", "Simpson", 10, false),
                    new PersonTableRecord("maggie-bouvier", recordId, "Maggie", "Simpson", 1, false)
                };
            case "mona-simpson":
                return new List<PersonTableRecord>()
                {
                    new PersonTableRecord("homer-simpson", recordId, "Homer", "Simpson", 35, false)
                };
            case "agnes-skinner":
                return new List<PersonTableRecord>()
                {
                    new PersonTableRecord("seymour-skinner", recordId, "Seymour", "Skinner", 42, false)
                };
            default:
                return new List<PersonTableRecord>();
        }
    }

    private async Task UpdateDelayedHierarchyTableAsync(bool setData = true)
    {
        if (setData)
        {
            await _delayedHierarchyTable!.SetDataAsync(_delayedHierarchyTableData);
        }

        List<TableSetRecordHierarchyOptions> options = new();
        _delayedHierarchyTableData.ForEach(person =>
        {
            if (_recordsLoadingChildren.Contains(person.Id))
            {
                options.Add(
                    new TableSetRecordHierarchyOptions(
                        person.Id,
                        new TableRecordHierarchyOptions(TableRecordDelayedHierarchyState.LoadingChildren)));
            }
            else if (person.HasChildren && !_recordsWithLoadedChildren.Contains(person.Id))
            {
                options.Add(
                    new TableSetRecordHierarchyOptions(
                        person.Id,
                        new TableRecordHierarchyOptions(TableRecordDelayedHierarchyState.CanLoadChildren)));
            }
        });
        await _delayedHierarchyTable!.SetRecordHierarchyOptionsAsync(options);
    }
}
