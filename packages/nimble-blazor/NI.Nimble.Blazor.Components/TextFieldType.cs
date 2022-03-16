namespace NI.Nimble.Blazor.Components;

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
        Enum.GetValues<TextFieldType>().ToDictionary(id => id, id => Enum.GetName(id)!.ToLowerInvariant());

    public static string? ToAttributeValue(this TextFieldType? value) => value == null ? null : _textFieldTypeValues[value.Value];
}