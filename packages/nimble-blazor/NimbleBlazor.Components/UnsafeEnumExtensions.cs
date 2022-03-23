namespace NimbleBlazor.Components;

/// <summary>
/// This class provides a
/// </summary>
internal static class UnsafeEnumExtensions
{
    public static string UnsafeGetName<TEnum>(this TEnum value)
            where TEnum : struct, Enum
    {
        var safeValue = Enum.GetName(value);
        return safeValue!;
    }
}
