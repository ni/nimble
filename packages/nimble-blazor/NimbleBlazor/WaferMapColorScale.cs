using System.Text.Json.Serialization;

namespace NimbleBlazor;

public class WaferMapColorScale
{
    [JsonPropertyName("colors")]
    public IEnumerable<string> Colors { get; set; }
    [JsonPropertyName("values")]
    public IEnumerable<string> Values { get; set; }

    public WaferMapColorScale(IEnumerable<string> colors, IEnumerable<string> values) {
        Colors = colors;
        Values = values;
    }
}
