namespace NimbleBlazor.Components;

public enum Appearance
{
    Block,
    Ghost,
    Outline,
    Underline
}

internal static class AppearanceExtensions
{
    private static readonly Dictionary<Appearance, string> _appearanceValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<Appearance>();

    public static string? ToAttributeValue(this Appearance? value) => value == null ? null : _appearanceValues[value.Value];
}
