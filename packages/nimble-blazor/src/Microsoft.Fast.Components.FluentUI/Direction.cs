namespace Microsoft.Fast.Components.FluentUI;

public enum Direction
{
    Previous,
    Next
}

internal static class DirectionExtensions
{
    private static readonly Dictionary<Direction, string> _directionValues =
        Enum.GetValues<Direction>().ToDictionary(id => id, id => Enum.GetName(id)!.ToLowerInvariant());

    public static string? ToAttributeValue(this Direction? value) => value == null ? null : _directionValues[value.Value];
}
