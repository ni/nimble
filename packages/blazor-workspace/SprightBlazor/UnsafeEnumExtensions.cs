namespace SprightBlazor;

/// <summary>
/// This class provides an unsafe means of retrieving the string name of an enum value.
/// Only use this if you are certain the provided 'value' parameter is a member of the `TEnum` type
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
