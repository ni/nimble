namespace NimbleBlazor;

public enum FilterMode
{
    None,
    Standard
}

internal static class FilterModeExtensions
{
    private static readonly Dictionary<FilterMode, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<FilterMode>();

    public static string? ToAttributeValue(this FilterMode? value) => (value == null || value == FilterMode.None) ? null : _enumValues[value.Value];
}
