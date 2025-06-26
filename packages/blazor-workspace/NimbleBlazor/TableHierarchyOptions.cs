using System.Text.Json.Serialization;

namespace NimbleBlazor;

public class TableRecordHierarchyOptions
{
    public TableRecordHierarchyOptions(TableRecordDelayedHierarchyState delayedHierarchyState)
    {
        DelayedHierarchyState = delayedHierarchyState;
    }

    [JsonConverter(typeof(TableRecordDelayedHierarchyStateConverter))]
    public TableRecordDelayedHierarchyState DelayedHierarchyState { get; set; }
}
