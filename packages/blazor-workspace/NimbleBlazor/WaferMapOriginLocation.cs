namespace NimbleBlazor;

public enum WaferMapOriginLocation
{
    BottomLeft,
    BottomRight,
    TopLeft,
    TopRight
}

internal static class WaferMapOriginLocationExtensions
{
    private static readonly Dictionary<WaferMapOriginLocation, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<WaferMapOriginLocation>();

    public static string? ToAttributeValue(this WaferMapOriginLocation? value) => (value == null || value == WaferMapOriginLocation.BottomLeft) ? null : _enumValues[value.Value];
}
