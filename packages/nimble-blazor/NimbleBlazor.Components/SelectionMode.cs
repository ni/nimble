namespace NimbleBlazor.Components;

public enum SelectionMode
{
    All,
    LeavesOnly
}

internal static class SelectionModeExtensions
{
    private static readonly Dictionary<SelectionMode, string> _selectionModeValues = AttributeHelpers.GetEnumNamesAsAttributeValues<SelectionMode>();

    public static string? ToAttributeValue(this SelectionMode? value) => value == null ? null : _selectionModeValues[value.Value];
}
