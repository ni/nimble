namespace OkBlazor;

public enum TableColumnPinLocation
{
    None,
    Left
}

internal static class TableColumnPinLocationExtensions
{
    private static readonly Dictionary<TableColumnPinLocation, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<TableColumnPinLocation>();

    public static string? ToAttributeValue(this TableColumnPinLocation? value) => (value == null || value == TableColumnPinLocation.None) ? null : _enumValues[value.Value];
}