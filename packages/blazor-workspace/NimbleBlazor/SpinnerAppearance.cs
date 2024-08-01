namespace NimbleBlazor;

public enum SpinnerAppearance
{
    Default,
    Accent
}

internal static class SpinnerAppearanceExtensions
{
    private static readonly Dictionary<SpinnerAppearance, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<SpinnerAppearance>();

    public static string? ToAttributeValue(this SpinnerAppearance? value) => (value == null || value == SpinnerAppearance.Default) ? null : _enumValues[value.Value];
}