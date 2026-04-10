namespace NimbleBlazor;

public enum StepSeverity
{
    Default,
    Error,
    Warning,
    Success
}

internal static class StepSeverityExtensions
{
    private static readonly Dictionary<StepSeverity, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<StepSeverity>();

    public static string? ToAttributeValue(this StepSeverity? value) => (value == null || value == StepSeverity.Default) ? null : _enumValues[value.Value];
}
