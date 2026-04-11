namespace OkBlazor;

public enum FvAccordionItemAppearance
{
    Outline,
    Ghost,
    Block
}

internal static class FvAccordionItemAppearanceExtensions
{
    private static readonly Dictionary<FvAccordionItemAppearance, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<FvAccordionItemAppearance>();

    public static string? ToAttributeValue(this FvAccordionItemAppearance? value) => value == null ? null : _enumValues[value.Value];
}