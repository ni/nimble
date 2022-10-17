namespace NimbleBlazor;

public enum NumberFieldAppearance
{
    Underline,
    Outline,
    Block
}

internal static class NumberFieldAppearanceExtensions
{
    private static readonly Dictionary<NumberFieldAppearance, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<NumberFieldAppearance>();

    public static string? ToAttributeValue(this NumberFieldAppearance? value) => value == null ? null : _enumValues[value.Value];
}
