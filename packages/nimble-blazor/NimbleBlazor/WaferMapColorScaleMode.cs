namespace NimbleBlazor;

public enum WaferMapColorScaleMode
{
    Linear,
    Ordinal
}

internal static class WaferMapColorScaleModeExtensions
{
    private static readonly Dictionary<WaferMapColorScaleMode, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<WaferMapColorScaleMode>();

    public static string? ToAttributeValue(this WaferMapColorScaleMode? value) => (value == null || value == WaferMapColorScaleMode.Linear) ? null : _enumValues[value.Value];
}