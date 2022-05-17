namespace NimbleBlazor.Components;

public enum TextFieldAppearance
{
    Underline,
    Outline,
    Block,
    Frameless
}

internal static class TextFieldAppearanceExtensions
{
    private static readonly Dictionary<TextFieldAppearance, string> _appearanceValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<TextFieldAppearance>();

    public static string? ToAttributeValue(this TextFieldAppearance? value) => value == null ? null : _appearanceValues[value.Value];
}
