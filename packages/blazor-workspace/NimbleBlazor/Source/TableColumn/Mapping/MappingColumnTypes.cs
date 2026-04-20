namespace NimbleBlazor;

public enum MappingColumnWidthMode
{
    Default,
    IconSize
}

internal static class MappingColumnWidthModeExtensions
{
    private static readonly Dictionary<MappingColumnWidthMode, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<MappingColumnWidthMode>();

    public static string? ToAttributeValue(this MappingColumnWidthMode? value) => (value == null || value == MappingColumnWidthMode.Default) ? null : _enumValues[value.Value];
}
