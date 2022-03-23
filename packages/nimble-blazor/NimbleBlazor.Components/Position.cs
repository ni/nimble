namespace NimbleBlazor.Components;

public enum Position
{
    Above,
    Below
}

internal static class PositionExtensions
{
    private static readonly Dictionary<Position, string> _positionValues =
#pragma warning disable CA1308 // Normalize strings to uppercase
        Enum.GetValues<Position>().ToDictionary(id => id, id => id.UnsafeGetName().ToLowerInvariant());
#pragma warning restore CA1308 // Normalize strings to uppercase

    public static string? ToAttributeValue(this Position? value) => value == null ? null : _positionValues[value.Value];
}
