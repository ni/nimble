using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTableColumnDateText : NimbleTableColumn, IFractionalWidthColumn, IGroupableColumn
{
    /// <summary>
    /// Gets or sets the field in the element representing a row of data in a <see cref="NimbleTable{TData}"/>to display
    /// </summary>
    [Parameter]
    [DisallowNull]
    public string FieldName { get; set; } = null!;

    /// <summary>
    /// The fractional/proportional width to use for this column
    /// </summary>
    [Parameter]
    public double FractionalWidth { get; set; } = 1;

    /// <summary>
    /// The minimum width (in pixels) for this column
    /// </summary>
    [Parameter]
    public double? MinPixelWidth { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Specifies the grouping precedence of the column within the set of all columns participating in grouping.
    /// Columns are rendered in the grouping tree from lowest group-index as the tree root to highest
    /// group-index as tree leaves.
    /// </summary>
    [Parameter]
    public int? GroupIndex { get; set; }

    /// <summary>
    /// Whether or not this column can be used to group rows by
    /// </summary>
    [Parameter]
    public bool? GroupingDisabled { get; set; }

    /// <summary>
    /// Formatting scheme to use
    /// </summary>
    [Parameter]
    public DateTextFormat? Format { get; set; }

    /// <summary>
    /// Algorithm to use when finding a match for the provided locale string
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public LocaleMatcherAlgorithm? CustomLocaleMatcher { get; set; }

    /// <summary>
    /// Format of the weekday
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public WeekdayFormat? CustomWeekday { get; set; }

    /// <summary>
    /// Format of the era
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public EraFormat? CustomEra { get; set; }

    /// <summary>
    /// Format of the year
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public YearFormat? CustomYear { get; set; }

    /// <summary>
    /// Format of the month
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public MonthFormat? CustomMonth { get; set; }

    /// <summary>
    /// Format of the day
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public DayFormat? CustomDay { get; set; }

    /// <summary>
    /// Format of the hour
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public HourFormat? CustomHour { get; set; }

    /// <summary>
    /// Format of the minute
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public MinuteFormat? CustomMinute { get; set; }

    /// <summary>
    /// Format of the second
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public SecondFormat? CustomSecond { get; set; }

    /// <summary>
    /// Format of the time zone name
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public TimeZoneNameFormat? CustomTimeZoneName { get; set; }

    /// <summary>
    /// Algorithm to use when finding a match for the provided format options
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public FormatMatcherAlgorithm? CustomFormatMatcher { get; set; }

    /// <summary>
    /// Whether to use 12-hour time or 24-hour time
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public Hour12Format? CustomHour12 { get; set; }

    /// <summary>
    /// Time zone to use
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public string? CustomTimeZone { get; set; }

    /// <summary>
    /// Calender to use
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public string? CustomCalendar { get; set; }

    /// <summary>
    /// Format of day periods like "in the morning", "am", "noon", etc.
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public DayPeriodFormat? CustomDayPeriod { get; set; }

    /// <summary>
    /// Numbering system to use
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public string? CustomNumberingSystem { get; set; }

    /// <summary>
    /// Date formatting style. This property is mutually exclusive with low-level properties like CustomMonth and CustomDay.
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public DateStyle? CustomDateStyle { get; set; }

    /// <summary>
    /// Time formatting style. This property is mutually exclusive with low-level properties like CustomHour and CustomTimeZoneName.
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public TimeStyle? CustomTimeStyle { get; set; }

    /// <summary>
    /// The hour cycle to use
    /// Refer to the options documentation for the JS Intl.DateTimeFormat constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
    /// </summary>
    [Parameter]
    public HourCycleFormat? CustomHourCycle { get; set; }
}