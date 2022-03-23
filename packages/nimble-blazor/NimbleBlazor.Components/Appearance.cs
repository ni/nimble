namespace NimbleBlazor.Components;

public enum Appearance
{
    Block,
    Ghost,
    Outline,
    Underline
}

internal static class AppearanceExtensions
{
    private static readonly Dictionary<Appearance, string> _appearanceValues =
#pragma warning disable CA1308 // Normalize strings to uppercase
        Enum.GetValues<Appearance>().ToDictionary(id => id, id => id.UnsafeGetName().ToLowerInvariant());
#pragma warning restore CA1308 // Normalize strings to uppercase

    public static string? ToAttributeValue(this Appearance? value) => value == null ? null : _appearanceValues[value.Value];
}
