namespace NimbleBlazor;

public enum Position
{
    Above,
    Below
}

internal static class PositionExtensions
{
    private static readonly Dictionary<Position, string> _positionValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<Position>();

    public static string? ToAttributeValue(this Position? value) => value == null ? null : _positionValues[value.Value];
}
