namespace NimbleBlazor;

public enum TableRecordDelayedHierarchyState
{
    None,
    CanLoadChildren,
    LoadingChildren
}

internal static class TableRecordDelayedHierarchyStateExtensions
{
    internal static readonly Dictionary<TableRecordDelayedHierarchyState, string> EnumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<TableRecordDelayedHierarchyState>();

    public static string? ToAttributeValue(this TableRecordDelayedHierarchyState? value) => (value == null || value == TableRecordDelayedHierarchyState.None) ? null : EnumValues[value.Value];
}
