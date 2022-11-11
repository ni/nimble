namespace NimbleBlazor;

public enum DrawerLocation
{
    Left,
    Right
}

internal static class DrawerLocationExtensions
{
    private static readonly Dictionary<DrawerLocation, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<DrawerLocation>();

    public static string? ToAttributeValue(this DrawerLocation? value) => value == null ? null : _enumValues[value.Value];
}
