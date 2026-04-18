namespace NimbleBlazor;

public enum Direction
{
    Ltr,
    Rtl
}

internal static class DirectionExtensions
{
    private static readonly Dictionary<Direction, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<Direction>();

    public static string? ToAttributeValue(this Direction? value) => value == null ? null : _enumValues[value.Value];
}
