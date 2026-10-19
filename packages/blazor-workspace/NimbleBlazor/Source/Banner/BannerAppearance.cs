namespace NimbleBlazor;

public enum BannerAppearance
{
    Block,
    Outline
}

internal static class BannerAppearanceExtensions
{
    private static readonly Dictionary<BannerAppearance, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<BannerAppearance>();

    public static string? ToAttributeValue(this BannerAppearance? value) => value == null ? null : _enumValues[value.Value];
}
