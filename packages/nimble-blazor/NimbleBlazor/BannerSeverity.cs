namespace NimbleBlazor;

public enum BannerSeverity
{
    Default,
    Information,
    Warning,
    Error
}

internal static class BannerSeverityExtensions
{
    private static readonly Dictionary<BannerSeverity, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<BannerSeverity>();

    public static string? ToAttributeValue(this BannerSeverity? value) => (value == null || value == BannerSeverity.Default) ? null : _enumValues[value.Value];
}
