namespace NimbleBlazor;

public enum TextAreaResize
{
    None,
    Both,
    Horizontal,
    Vertical
}

internal static class TextAreaResizeExtensions
{
    private static readonly Dictionary<TextAreaResize, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<TextAreaResize>();

    public static string? ToAttributeValue(this TextAreaResize? value) => value == null ? null : _enumValues[value.Value];
}
