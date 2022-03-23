namespace NimbleBlazor.Components;

public enum TextFieldType
{
    Text,
    Email,
    Password,
    Tel,
    Url
}

internal static class TextFieldTypeExtensions
{
    private static readonly Dictionary<TextFieldType, string> _textFieldTypeValues =
#pragma warning disable CA1308 // Normalize strings to uppercase
        Enum.GetValues<TextFieldType>().ToDictionary(id => id, id => id.UnsafeGetName().ToLowerInvariant());
#pragma warning restore CA1308 // Normalize strings to uppercase

    public static string? ToAttributeValue(this TextFieldType? value) => value == null ? null : _textFieldTypeValues[value.Value];
}
