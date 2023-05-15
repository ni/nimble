using System.Text.Json;
using System.Text.Json.Serialization;

namespace NimbleBlazor;

internal class TableColumnSortDirectionConverter : JsonConverter<TableColumnSortDirection>
{
    public override TableColumnSortDirection Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        return TableColumnSortDirectionExtensions.EnumValues.FirstOrDefault(x => x.Value == value).Key;
    }

    public override void Write(
            Utf8JsonWriter writer,
            TableColumnSortDirection value,
            JsonSerializerOptions options)
    {
        var convertedValue = (value as TableColumnSortDirection?).ToAttributeValue();
        writer.WriteStringValue(convertedValue);
    }
}
