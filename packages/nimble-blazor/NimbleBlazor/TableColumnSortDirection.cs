namespace NimbleBlazor;

public enum TableColumnSortDirection
{
    None,
    Ascending,
    Descending
}

internal static class TableColumnSortDirectionExtensions
{
    internal static readonly Dictionary<TableColumnSortDirection, string> EnumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<TableColumnSortDirection>();

    public static string? ToAttributeValue(this TableColumnSortDirection? value) => (value == null || value == TableColumnSortDirection.None) ? null : EnumValues[value.Value];
}
