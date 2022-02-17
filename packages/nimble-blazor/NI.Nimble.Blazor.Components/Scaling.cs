namespace NI.Nimble.Components;

public enum Scaling
{
    Content,
    Fill,
    Anchor
}

internal static class ScalingExtensions
{
    private static readonly Dictionary<Scaling, string> _scalingValues =
        Enum.GetValues<Scaling>().ToDictionary(id => id, id => Enum.GetName(id)!.ToLowerInvariant());

    public static string? ToAttributeValue(this Scaling? value) => value == null ? null : _scalingValues[value.Value];
}