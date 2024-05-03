namespace NimbleBlazor;

public enum Orientation
{
    Horizontal,
    Vertical
}

internal static class OrientationExtensions
{
    private static readonly Dictionary<Orientation, string> _orientationValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<Orientation>();

    public static string? ToAttributeValue(this Orientation? value) => value == null ? null : _orientationValues[value.Value];
}