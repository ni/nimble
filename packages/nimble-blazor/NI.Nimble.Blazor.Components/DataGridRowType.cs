using System.Text.RegularExpressions;

namespace NI.Nimble.Components;

public enum DataGridRowType
{
    Default,
    Header,
    StickyHeader
}

internal static class DataGridRowTypeExtensions
{
    private static readonly Dictionary<DataGridRowType, string> _dataGridRowTypeValues =
        Enum.GetValues<DataGridRowType>().ToDictionary(id => id, id => string.Join("-", Regex.Split(Enum.GetName(id)!, @"(?<!^)(?=[A-Z](?![A-Z]|$))")).ToLowerInvariant());

    public static string? ToAttributeValue(this DataGridRowType? value) => value == null ? null : _dataGridRowTypeValues[value.Value];
}