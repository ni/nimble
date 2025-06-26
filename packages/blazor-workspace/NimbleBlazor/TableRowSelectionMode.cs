namespace NimbleBlazor;

public enum TableRowSelectionMode
{
    None,
#pragma warning disable CA1720 // Identifier contains type name
    Single,
#pragma warning restore CA1720 // Identifier contains type name
    Multiple
}

internal static class TableRowSelectionModeExtensions
{
    private static readonly Dictionary<TableRowSelectionMode, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<TableRowSelectionMode>();

    public static string? ToAttributeValue(this TableRowSelectionMode? value) => (value == null || value == TableRowSelectionMode.None) ? null : _enumValues[value.Value];
}
