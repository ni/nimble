﻿namespace NimbleBlazor.Components;

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
    private static readonly Dictionary<TextFieldType, string> _textFieldTypeValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<TextFieldType>();

    public static string? ToAttributeValue(this TextFieldType? value) => value == null ? null : _textFieldTypeValues[value.Value];
}
