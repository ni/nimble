namespace NimbleBlazor.Components;

public enum ButtonAppearance
{
    Outline,
    Ghost,
    Block
}

internal static class ButtonAppearanceExtensions
{
    private static readonly Dictionary<ButtonAppearance, string> _appearanceValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<ButtonAppearance>();

    public static string? ToAttributeValue(this ButtonAppearance? value) => value == null ? null : _appearanceValues[value.Value];
}
