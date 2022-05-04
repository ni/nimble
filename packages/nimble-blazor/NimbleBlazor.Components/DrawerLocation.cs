namespace NimbleBlazor.Components;

public enum DrawerLocation
{
    Left,
    Right
}

internal static class DrawerLocationExtensions
{
    private static readonly Dictionary<DrawerLocation, string> _drawerLocationValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<DrawerLocation>();

    public static string? ToAttributeValue(this DrawerLocation? value) => value == null ? null : _drawerLocationValues[value.Value];
}
