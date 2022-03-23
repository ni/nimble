namespace NimbleBlazor.Components;

public enum SelectionMode
{
    All,
    LeavesOnly
}

internal static class SelectionModeExtensions
{
    private static readonly Dictionary<SelectionMode, string> _selectionModeValues =
#pragma warning disable CA1308 // Normalize strings to uppercase
        Enum.GetValues<SelectionMode>().ToDictionary(id => id, id => id.SafeGetName().ToLowerInvariant());
#pragma warning restore CA1308 // Normalize strings to uppercase

    public static string? ToAttributeValue(this SelectionMode? value) => value == null ? null : _selectionModeValues[value.Value];
}
