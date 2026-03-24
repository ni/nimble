namespace SprightBlazor;

public enum ChatMessageType
{
    System,
    Outbound,
    Inbound
}

internal static class ChatMessageTypeExtensions
{
    private static readonly Dictionary<ChatMessageType, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<ChatMessageType>();

    public static string? ToAttributeValue(this ChatMessageType? value) => value == null ? null : _enumValues[value.Value];
}
