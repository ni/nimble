namespace NI.Nimble.Components;

public enum ExpandMode
{
    Single
}

internal static class ExpandModeExtensions
{
    private static readonly Dictionary<ExpandMode, string> _expandModeValues =
        Enum.GetValues<ExpandMode>().ToDictionary(id => id, id => Enum.GetName(id)!.ToLowerInvariant());

    public static string? ToAttributeValue(this ExpandMode? value) => value == null ? null : _expandModeValues[value.Value];
}