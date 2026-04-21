namespace NimbleBlazor;

public enum Position
{
    Above,
    Below
}

internal static class PositionExtensions
{
    private static readonly Dictionary<Position, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<Position>();

    public static string? ToAttributeValue(this Position? value) => value == null ? null : _enumValues[value.Value];
}
