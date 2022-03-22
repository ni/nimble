namespace NimbleBlazor.Components;

public enum SelectionMode
{
    All,
    LeavesOnly
}

internal static class SelectionModeExtensions
{
    private static readonly Dictionary<SelectionMode, string> _selectionModeValues =
        Enum.GetValues<SelectionMode>().ToDictionary(id => id, id => Enum.GetName(id)!.ToLowerInvariant());

    public static string? ToAttributeValue(this SelectionMode? value) => value == null ? null : _selectionModeValues[value.Value];
}