namespace OkBlazor;

public enum FvSearchInputAppearance
{
    Block,
    Outline,
    Ghost,
    SuperGhost
}

internal static class FvSearchInputAppearanceExtensions
{
    private static readonly Dictionary<FvSearchInputAppearance, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<FvSearchInputAppearance>();

    public static string? ToAttributeValue(this FvSearchInputAppearance? value) => value == null ? null : _enumValues[value.Value];
}