using System.Text.Json.Serialization;

namespace NimbleBlazor;

public interface ITableValidity
{
    public bool DuplicateRowId { get; }

    public bool MissingRowId { get; }

    public bool InvalidRowId { get; }
}

internal class TableValidity : ITableValidity
{
    [JsonPropertyName("duplicateRowId")]
    public bool DuplicateRowId { get; set; }

    [JsonPropertyName("missingRowId")]
    public bool MissingRowId { get; set; }

    [JsonPropertyName("invalidRowId")]
    public bool InvalidRowId { get; set; }
}
