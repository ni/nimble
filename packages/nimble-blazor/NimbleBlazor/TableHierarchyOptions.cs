using System.Text.Json.Serialization;

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

public class TableRecordHierarchyOptions
{
    public TableRecordHierarchyOptions(TableRecordDelayedHierarchyState delayedHierarchyState)
    {
        DelayedHierarchyState = delayedHierarchyState;
    }

    [JsonConverter(typeof(TableRecordDelayedHierarchyStateConverter))]
    public TableRecordDelayedHierarchyState DelayedHierarchyState { get; set; }
}
