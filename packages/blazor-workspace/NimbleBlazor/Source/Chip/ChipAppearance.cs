namespace NimbleBlazor;

public enum ChipAppearance
{
    Outline,
    Block
}

internal static class ChipAppearanceExtensions
{
    private static readonly Dictionary<ChipAppearance, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<ChipAppearance>();

    public static string? ToAttributeValue(this ChipAppearance? value) => value == null ? null : _enumValues[value.Value];
}
