namespace NimbleBlazor;

public enum MenuButtonPosition
{
    Above,
    Below,
    Auto
}

internal static class MenuButtonPositionExtensions
{
    private static readonly Dictionary<MenuButtonPosition, string> _menuButtonPositionValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<MenuButtonPosition>();

    public static string? ToAttributeValue(this MenuButtonPosition? value) => value == null ? null : _menuButtonPositionValues[value.Value];
}
