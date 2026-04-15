namespace NimbleBlazor;

public enum AnchorStepSeverity
{
    Default,
    Error,
    Warning,
    Success
}

internal static class AnchorStepSeverityExtensions
{
    private static readonly Dictionary<AnchorStepSeverity, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<AnchorStepSeverity>();

    public static string? ToAttributeValue(this AnchorStepSeverity? value) => (value == null || value == AnchorStepSeverity.Default) ? null : _enumValues[value.Value];
}
