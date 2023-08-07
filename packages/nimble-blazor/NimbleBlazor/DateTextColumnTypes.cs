namespace NimbleBlazor;

public enum DateTextFormat
{
    Custom
}

internal static class DateTextFormatExtensions
{
    private static readonly Dictionary<DateTextFormat, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<DateTextFormat>();

    public static string? ToAttributeValue(this DateTextFormat? value) => value == null ? null : _enumValues[value.Value];
}

public enum LocaleMatcherAlgorithm
{
    BestFit,
    Lookup
}

internal static class LocaleMatcherAlgorithmExtensions
{
    private static readonly Dictionary<LocaleMatcherAlgorithm, string> _enumValues = new Dictionary<LocaleMatcherAlgorithm, string> {
        [LocaleMatcherAlgorithm.BestFit] = "best fit",
        [LocaleMatcherAlgorithm.Lookup] = "lookup"
    };

    public static string? ToAttributeValue(this LocaleMatcherAlgorithm? value) => value == null ? null : _enumValues[value.Value];
}

public enum WeekdayFormat
{
    Long,
    Short,
    Narrow
}

internal static class WeekdayFormatExtensions
{
    private static readonly Dictionary<WeekdayFormat, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<WeekdayFormat>();

    public static string? ToAttributeValue(this WeekdayFormat? value) => value == null ? null : _enumValues[value.Value];
}

public enum EraFormat
{
    Long,
    Short,
    Narrow
}

internal static class EraFormatExtensions
{
    private static readonly Dictionary<EraFormat, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<EraFormat>();

    public static string? ToAttributeValue(this EraFormat? value) => value == null ? null : _enumValues[value.Value];
}

public enum YearFormat
{
    Numeric,
    TwoDigit
}

internal static class YearFormatExtensions
{
    private static readonly Dictionary<YearFormat, string> _enumValues = new Dictionary<YearFormat, string> {
        [YearFormat.Numeric] = "numeric",
        [YearFormat.TwoDigit] = "2-digit"
    };

    public static string? ToAttributeValue(this YearFormat? value) => value == null ? null : _enumValues[value.Value];
}

public enum MonthFormat
{
    Numeric,
    TwoDigit,
    Long,
    Short,
    Narrow
}

internal static class MonthFormatExtensions
{
    private static readonly Dictionary<MonthFormat, string> _enumValues = new Dictionary<MonthFormat, string> {
        [MonthFormat.Numeric] = "numeric",
        [MonthFormat.TwoDigit] = "2-digit",
        [MonthFormat.Long] = "long",
        [MonthFormat.Short] = "short",
        [MonthFormat.Narrow] = "narrow"
    };

    public static string? ToAttributeValue(this MonthFormat? value) => value == null ? null : _enumValues[value.Value];
}

public enum DayFormat
{
    Numeric,
    TwoDigit
}

internal static class DayFormatExtensions
{
    private static readonly Dictionary<DayFormat, string> _enumValues = new Dictionary<DayFormat, string> {
        [DayFormat.Numeric] = "numeric",
        [DayFormat.TwoDigit] = "2-digit"
    };

    public static string? ToAttributeValue(this DayFormat? value) => value == null ? null : _enumValues[value.Value];
}

public enum HourFormat
{
    Numeric,
    TwoDigit
}

internal static class HourFormatExtensions
{
    private static readonly Dictionary<HourFormat, string> _enumValues = new Dictionary<HourFormat, string> {
        [HourFormat.Numeric] = "numeric",
        [HourFormat.TwoDigit] = "2-digit"
    };

    public static string? ToAttributeValue(this HourFormat? value) => value == null ? null : _enumValues[value.Value];
}

public enum MinuteFormat
{
    Numeric,
    TwoDigit
}

internal static class MinuteFormatExtensions
{
    private static readonly Dictionary<MinuteFormat, string> _enumValues = new Dictionary<MinuteFormat, string> {
        [MinuteFormat.Numeric] = "numeric",
        [MinuteFormat.TwoDigit] = "2-digit"
    };

    public static string? ToAttributeValue(this MinuteFormat? value) => value == null ? null : _enumValues[value.Value];
}

public enum SecondFormat
{
    Numeric,
    TwoDigit
}

internal static class SecondFormatExtensions
{
    private static readonly Dictionary<SecondFormat, string> _enumValues = new Dictionary<SecondFormat, string> {
        [SecondFormat.Numeric] = "numeric",
        [SecondFormat.TwoDigit] = "2-digit"
    };

    public static string? ToAttributeValue(this SecondFormat? value) => value == null ? null : _enumValues[value.Value];
}

public enum TimeZoneNameFormat
{
    Long,
    Short,
    ShortOffset,
    ShortGeneric,
    LongOffset,
    LongGeneric
}

internal static class TimeZoneNameFormatExtensions
{
    private static readonly Dictionary<TimeZoneNameFormat, string> _enumValues = new Dictionary<TimeZoneNameFormat, string> {
        [TimeZoneNameFormat.Long] = "long",
        [TimeZoneNameFormat.Short] = "short",
        [TimeZoneNameFormat.ShortOffset] = "shortOffset",
        [TimeZoneNameFormat.ShortGeneric] = "shortGeneric",
        [TimeZoneNameFormat.LongOffset] = "longOffset",
        [TimeZoneNameFormat.LongGeneric] = "longGeneric"
    };

    public static string? ToAttributeValue(this TimeZoneNameFormat? value) => value == null ? null : _enumValues[value.Value];
}

public enum FormatMatcherAlgorithm
{
    BestFit,
    Basic
}

internal static class FormatMatcherAlgorithmExtensions
{
    private static readonly Dictionary<FormatMatcherAlgorithm, string> _enumValues = new Dictionary<FormatMatcherAlgorithm, string> {
        [FormatMatcherAlgorithm.BestFit] = "best fit",
        [FormatMatcherAlgorithm.Basic] = "basic"
    };

    public static string? ToAttributeValue(this FormatMatcherAlgorithm? value) => value == null ? null : _enumValues[value.Value];
}

public enum Hour12Format
{
    TwelveHour,
    TwentyFourHour
}

internal static class Hour12FormatExtensions
{
    private static readonly Dictionary<Hour12Format, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<Hour12Format>();

    public static string? ToAttributeValue(this Hour12Format? value) => value == null ? null : _enumValues[value.Value];
}

public enum DayPeriodFormat
{
    Narrow,
    Short,
    Long
}

internal static class DayPeriodFormatExtensions
{
    private static readonly Dictionary<DayPeriodFormat, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<DayPeriodFormat>();

    public static string? ToAttributeValue(this DayPeriodFormat? value) => value == null ? null : _enumValues[value.Value];
}

public enum DateStyle
{
    Full,
    Long,
    Medium,
    Short
}

internal static class DateStyleExtensions
{
    private static readonly Dictionary<DateStyle, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<DateStyle>();


    public static string? ToAttributeValue(this DateStyle? value) => value == null ? null : _enumValues[value.Value];
}

public enum TimeStyle
{
    Full,
    Long,
    Medium,
    Short
}

internal static class TimeStyleExtensions
{
    private static readonly Dictionary<TimeStyle, string> _enumValues = AttributeHelpers.GetEnumNamesAsKebabCaseValues<TimeStyle>();

    public static string? ToAttributeValue(this TimeStyle? value) => value == null ? null : _enumValues[value.Value];
}

public enum HourCycleFormat
{
    H11,
    H12,
    H23,
    H24
}

internal static class HourCycleFormatExtensions
{
    private static readonly Dictionary<HourCycleFormat, string> _enumValues = new Dictionary<HourCycleFormat, string> {
        [HourCycleFormat.H11] = "h11",
        [HourCycleFormat.H12] = "h12",
        [HourCycleFormat.H23] = "h23",
        [HourCycleFormat.H24] = "h24"
    };

    public static string? ToAttributeValue(this HourCycleFormat? value) => value == null ? null : _enumValues[value.Value];
}
