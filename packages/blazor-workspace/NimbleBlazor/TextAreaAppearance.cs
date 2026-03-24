namespace NimbleBlazor;

public enum TextAreaAppearance
{
    Outline,
    Block
}

internal static class TextAreaAppearanceExtensions
{
    private static readonly Dictionary<TextAreaAppearance, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<TextAreaAppearance>();

    public static string? ToAttributeValue(this TextAreaAppearance? value) => value == null ? null : _enumValues[value.Value];
}
