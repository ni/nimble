namespace NimbleBlazor;

public enum SpinnerSize
{
    Default,
    Medium,
    Large
}

internal static class SpinnerSizeExtensions
{
    private static readonly Dictionary<SpinnerSize, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<SpinnerSize>();

    public static string? ToAttributeValue(this SpinnerSize? value) => (value == null || value == SpinnerSize.Default) ? null : _enumValues[value.Value];
}
