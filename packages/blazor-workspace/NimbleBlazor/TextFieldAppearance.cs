namespace NimbleBlazor;

public enum TextFieldAppearance
{
    Underline,
    Outline,
    Block,
    Frameless
}

internal static class TextFieldAppearanceExtensions
{
    private static readonly Dictionary<TextFieldAppearance, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<TextFieldAppearance>();

    public static string? ToAttributeValue(this TextFieldAppearance? value) => value == null ? null : _enumValues[value.Value];
}
