using System.Text.Json.Serialization;

namespace NimbleBlazor;

public class WaferMapDie
{
    [JsonPropertyName("value")]
    public string? Value { get; set; }
    [JsonPropertyName("x")]
    public double X { get; set; }
    [JsonPropertyName("y")]
    public double Y { get; set; }
    [JsonPropertyName("index")]
    public int? Index { get; set; }
    [JsonPropertyName("metadata")]
    public string? Metadata { get; set; }
    [JsonPropertyName("tags")]
    public IEnumerable<string>? Tags { get; set; }

    public WaferMapDie(double x, double y, int? index, string? value, string? metadata = null, IEnumerable<string>? tags = null)
    {
        X = x;
        Y = y;
        Index = index;
        Value = value;
        Metadata = metadata;
        Tags = tags;
    }
}
