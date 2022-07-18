namespace NimbleBlazor;

public enum AutoComplete
{
    Inline,
    List,
    Both,
    None
}

internal static class AutoCompleteExtensions
{
    private static readonly Dictionary<AutoComplete, string> _autoCompleteValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<AutoComplete>();

    public static string? ToAttributeValue(this AutoComplete? value) => value == null ? null : _autoCompleteValues[value.Value];
}
