namespace NimbleBlazor;

public enum IconSeverity
{
    Default,
    Success,
    Information,
    Warning,
    Error
}

internal static class IconSeverityExtensions
{
    private static readonly Dictionary<IconSeverity, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<IconSeverity>();

    public static string? ToAttributeValue(this IconSeverity? value) => (value == null || value == IconSeverity.Default) ? null : _enumValues[value.Value];
}
