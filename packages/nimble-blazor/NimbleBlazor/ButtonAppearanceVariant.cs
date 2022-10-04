namespace NimbleBlazor;

public enum ButtonAppearanceVariant
{
    Default,
    Primary
}

internal static class ButtonAppearanceVariantExtensions
{
    private static readonly Dictionary<ButtonAppearanceVariant, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<ButtonAppearanceVariant>();

    public static string? ToAttributeValue(this ButtonAppearanceVariant? value) => (value == null || value == ButtonAppearanceVariant.Default) ? null : _enumValues[value.Value];
}
