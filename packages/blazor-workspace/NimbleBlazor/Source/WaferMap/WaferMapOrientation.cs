namespace NimbleBlazor;

public enum WaferMapOrientation
{
    Top,
    Bottom,
    Left,
    Right
}

internal static class WaferMapOrientationExtensions
{
    private static readonly Dictionary<WaferMapOrientation, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<WaferMapOrientation>();

    public static string? ToAttributeValue(this WaferMapOrientation? value) => (value == null || value == WaferMapOrientation.Top) ? null : _enumValues[value.Value];
}
