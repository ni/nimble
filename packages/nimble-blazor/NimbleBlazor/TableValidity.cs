using System.Text.Json.Serialization;

namespace NimbleBlazor;

public interface ITableValidity
{
    public bool DuplicateRecordId { get; }

    public bool MissingRecordId { get; }

    public bool InvalidRecordId { get; }

    public bool DuplicateColumnId { get; }

    public bool MissingColumnId { get; }

    public bool DuplicateSortIndex { get; }

    public bool DuplicateGroupIndex { get; }

    public bool IdFieldNameNotConfigured { get; }
}

internal class TableValidity : ITableValidity
{
    [JsonPropertyName("duplicateRecordId")]
    public bool DuplicateRecordId { get; set; }

    [JsonPropertyName("missingRecordId")]
    public bool MissingRecordId { get; set; }

    [JsonPropertyName("invalidRecordId")]
    public bool InvalidRecordId { get; set; }

    [JsonPropertyName("duplicateColumnId")]
    public bool DuplicateColumnId { get; set; }

    [JsonPropertyName("missingColumnId")]
    public bool MissingColumnId { get; set; }

    [JsonPropertyName("duplicateSortIndex")]
    public bool DuplicateSortIndex { get; set; }

    [JsonPropertyName("duplicateGroupIndex")]
    public bool DuplicateGroupIndex { get; set; }

    [JsonPropertyName("idFieldNameNotConfigured")]
    public bool IdFieldNameNotConfigured { get; set; }
}
