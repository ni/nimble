namespace NimbleBlazor;

public enum AnchorAppearance
{
    Default,
    Prominent
}

internal static class AnchorAppearanceExtensions
{
    private static readonly Dictionary<AnchorAppearance, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<AnchorAppearance>();

    public static string? ToAttributeValue(this AnchorAppearance? value) => (value == null || value == AnchorAppearance.Default) ? null : _enumValues[value.Value];
}
