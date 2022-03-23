namespace NimbleBlazor.Components;

internal static class SafeEnumExtensions
{
    public static string SafeGetName<TEnum>(this TEnum value)
            where TEnum : struct, Enum
    {
        var safeValue = Enum.GetName(value);
        return safeValue!;
    }
}
