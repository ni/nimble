namespace NimbleBlazor;

public enum Direction
{
    Ltr,
    Rtl
}

internal static class DirectionExtensions
{
    private static readonly Dictionary<Direction, string> _directionValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<Direction>();

    public static string? ToAttributeValue(this Direction? value) => value == null ? null : _directionValues[value.Value];
}
