using System.Text.Json.Serialization;

namespace NimbleBlazor;

public interface ITableValidity
{
    public bool DuplicateRecordId { get; }

    public bool MissingRecordId { get; }

    public bool InvalidRecordId { get; }
}

internal class TableValidity : ITableValidity
{
    [JsonPropertyName("duplicateRecordId")]
    public bool DuplicateRecordId { get; set; }

    [JsonPropertyName("missingRecordId")]
    public bool MissingRecordId { get; set; }

    [JsonPropertyName("invalidRecordId")]
    public bool InvalidRecordId { get; set; }
}
