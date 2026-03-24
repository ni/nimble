using System.Text.Json.Serialization;

namespace NimbleBlazor;

public interface ITableValidity
{
    bool DuplicateRecordId { get; }

    bool MissingRecordId { get; }

    bool InvalidRecordId { get; }

    bool DuplicateColumnId { get; }

    bool MissingColumnId { get; }

    bool InvalidColumnConfiguration { get; }

    bool DuplicateSortIndex { get; }

    bool DuplicateGroupIndex { get; }

    bool IdFieldNameNotConfigured { get; }
}

internal sealed class TableValidity : ITableValidity
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

    [JsonPropertyName("invalidColumnConfiguration")]
    public bool InvalidColumnConfiguration { get; set; }

    [JsonPropertyName("duplicateSortIndex")]
    public bool DuplicateSortIndex { get; set; }

    [JsonPropertyName("duplicateGroupIndex")]
    public bool DuplicateGroupIndex { get; set; }

    [JsonPropertyName("idFieldNameNotConfigured")]
    public bool IdFieldNameNotConfigured { get; set; }
}
