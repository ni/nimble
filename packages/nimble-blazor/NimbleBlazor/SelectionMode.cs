namespace NimbleBlazor;

public enum SelectionMode
{
    All,
    LeavesOnly,
    None
}

internal static class SelectionModeExtensions
{
    private static readonly Dictionary<SelectionMode, string> _selectionModeValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<SelectionMode>();

    public static string? ToAttributeValue(this SelectionMode? value) => value == null ? null : _selectionModeValues[value.Value];
}
