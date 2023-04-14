namespace NimbleBlazor;

public enum TableRowSelectionMode
{
    None,
    Single,
    Multiple
}

internal static class TableRowSelectionModeExtensions
{
    private static readonly Dictionary<TableRowSelectionMode, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<TableRowSelectionMode>();

    public static string? ToAttributeValue(this TableRowSelectionMode? value) => (value == null || value == TableRowSelectionMode.None) ? null : _enumValues[value.Value];
}
