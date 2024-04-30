using System.Text.Json;
using System.Text.Json.Serialization;

namespace NimbleBlazor;

internal sealed class TableRecordDelayedHierarchyStateConverter : JsonConverter<TableRecordDelayedHierarchyState>
{
    public override TableRecordDelayedHierarchyState Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        return TableRecordDelayedHierarchyStateExtensions.EnumValues.FirstOrDefault(x => x.Value == value).Key;
    }

    public override void Write(Utf8JsonWriter writer, TableRecordDelayedHierarchyState value, JsonSerializerOptions options)
    {
        var convertedValue = (value as TableRecordDelayedHierarchyState?).ToAttributeValue();
        writer.WriteStringValue(convertedValue);
    }
}
