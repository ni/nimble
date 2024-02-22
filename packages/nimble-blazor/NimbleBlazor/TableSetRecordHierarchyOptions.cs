namespace NimbleBlazor;

public class TableSetRecordHierarchyOptions
{
    public TableSetRecordHierarchyOptions(string recordId, TableRecordHierarchyOptions options)
    {
        RecordId = recordId;
        Options = options;
    }

    public string RecordId { get; set; }

    public TableRecordHierarchyOptions Options { get; set; }
}
