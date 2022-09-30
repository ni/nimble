namespace NimbleBlazor;

public enum BreadcrumbAppearance
{
    Default,
    Prominent
}

internal static class BreadcrumbAppearanceExtensions
{
    private static readonly Dictionary<BreadcrumbAppearance, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<BreadcrumbAppearance>();

    public static string? ToAttributeValue(this BreadcrumbAppearance? value) => (value == null || value == BreadcrumbAppearance.Default) ? null : _enumValues[value.Value];
}
