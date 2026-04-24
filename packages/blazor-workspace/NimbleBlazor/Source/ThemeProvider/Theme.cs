namespace NimbleBlazor;

public enum Theme
{
    Light,
    Dark,
    Color
}

internal static class ThemeExtensions
{
    private static readonly Dictionary<Theme, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<Theme>();

    public static string? ToAttributeValue(this Theme? value) => value == null ? null : _enumValues[value.Value];
}
