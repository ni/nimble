namespace NimbleBlazor;

public enum TooltipSeverity
{
    Default,
    Information,
    Warning,
    Error
}

internal static class TooltipSeverityExtensions
{
    private static readonly Dictionary<TooltipSeverity, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<TooltipSeverity>();

    public static string? ToAttributeValue(this TooltipSeverity? value) => (value == null || value == TooltipSeverity.Default) ? null : _enumValues[value.Value];
}
