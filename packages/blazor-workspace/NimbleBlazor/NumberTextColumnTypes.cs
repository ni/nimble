// Suppressing rule "Identifiers should not contain type names" because "Decimal" is a type identifier
#pragma warning disable CA1720
namespace NimbleBlazor;

public enum NumberTextFormat
{
    Default,
    Decimal
}

internal static class NumberTextFormatExtensions
{
    private static readonly Dictionary<NumberTextFormat, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<NumberTextFormat>();

    public static string? ToAttributeValue(this NumberTextFormat? value) => (value == null || value == NumberTextFormat.Default) ? null : _enumValues[value.Value];
}

public enum NumberTextAlignment
{
    Default,
    Right,
    Left
}

internal static class NumberTextAlignmentExtensions
{
    private static readonly Dictionary<NumberTextAlignment, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<NumberTextAlignment>();

    public static string? ToAttributeValue(this NumberTextAlignment? value) => (value == null || value == NumberTextAlignment.Default) ? null : _enumValues[value.Value];
}