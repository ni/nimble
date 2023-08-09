namespace NimbleBlazor;

#pragma warning disable CA1720
public enum MappingKeyType
{
    String,
    Number,
    Boolean
}
#pragma warning restore CA1720

internal static class MappingKeyExtensions
{
    private static readonly Dictionary<MappingKeyType, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<MappingKeyType>();

    public static string? ToAttributeValue(this MappingKeyType? value) => value == null ? null : _enumValues[value.Value];
}