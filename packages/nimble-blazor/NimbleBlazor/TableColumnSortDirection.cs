namespace NimbleBlazor;

public enum TableColumnSortDirection
{
    None,
    Ascending,
    Descending
}

internal static class TableColumnSortDirectionExtensions
{
    private static readonly Dictionary<TableColumnSortDirection, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<TableColumnSortDirection>();

    public static string? ToAttributeValue(this TableColumnSortDirection? value) => (value == null || value == TableColumnSortDirection.None) ? null : _enumValues[value.Value];
}
