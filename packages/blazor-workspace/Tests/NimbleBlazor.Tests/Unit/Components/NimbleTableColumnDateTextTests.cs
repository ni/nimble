using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnDateText"/>
/// </summary>
public class NimbleTableColumnDateTextTests : BunitTestBase
{
    [Fact]
    public void NimbleTableColumnDateText_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleTableColumnDateText>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FieldName!, "FirstName");

        table.AssertAttribute("field-name", "FirstName");
    }

    [Fact]
    public void NimbleTableColumnDateText_WithPlaceholderAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.Placeholder, "Custom placeholder");

        table.AssertAttribute("placeholder", "Custom placeholder");
    }

    [Theory]
    [InlineData(DateTextFormat.Default, null)]
    [InlineData(DateTextFormat.Custom, "custom")]
    public void NimbleTableColumnDateText_WithFormatAttribute_HasTableMarkup(DateTextFormat value, string? expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.Format, value);
        table.AssertAttribute("format", expectedAttributeValue);
    }

    [Theory]
    [InlineData(LocaleMatcherAlgorithm.BestFit, "best fit")]
    [InlineData(LocaleMatcherAlgorithm.Lookup, "lookup")]
    public void NimbleTableColumnDateText_WithCustomLocaleMatcherAttribute_HasTableMarkup(LocaleMatcherAlgorithm value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomLocaleMatcher, value);
        table.AssertAttribute("custom-locale-matcher", expectedAttributeValue);
    }

    [Theory]
    [InlineData(WeekdayFormat.Long, "long")]
    [InlineData(WeekdayFormat.Short, "short")]
    [InlineData(WeekdayFormat.Narrow, "narrow")]
    public void NimbleTableColumnDateText_WithCustomWeekdayAttribute_HasTableMarkup(WeekdayFormat value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomWeekday, value);
        table.AssertAttribute("custom-weekday", expectedAttributeValue);
    }

    [Theory]
    [InlineData(EraFormat.Long, "long")]
    [InlineData(EraFormat.Short, "short")]
    [InlineData(EraFormat.Narrow, "narrow")]
    public void NimbleTableColumnDateText_WithCustomEraAttribute_HasTableMarkup(EraFormat value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomEra, value);
        table.AssertAttribute("custom-era", expectedAttributeValue);
    }

    [Theory]
    [InlineData(YearFormat.Numeric, "numeric")]
    [InlineData(YearFormat.TwoDigit, "2-digit")]
    public void NimbleTableColumnDateText_WithCustomYearAttribute_HasTableMarkup(YearFormat value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomYear, value);
        table.AssertAttribute("custom-year", expectedAttributeValue);
    }

    [Theory]
    [InlineData(MonthFormat.Numeric, "numeric")]
    [InlineData(MonthFormat.TwoDigit, "2-digit")]
    [InlineData(MonthFormat.Long, "long")]
    [InlineData(MonthFormat.Short, "short")]
    [InlineData(MonthFormat.Narrow, "narrow")]
    public void NimbleTableColumnDateText_WithCustomMonthAttribute_HasTableMarkup(MonthFormat value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomMonth, value);
        table.AssertAttribute("custom-month", expectedAttributeValue);
    }

    [Theory]
    [InlineData(DayFormat.Numeric, "numeric")]
    [InlineData(DayFormat.TwoDigit, "2-digit")]
    public void NimbleTableColumnDateText_WithCustomDayAttribute_HasTableMarkup(DayFormat value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomDay, value);
        table.AssertAttribute("custom-day", expectedAttributeValue);
    }

    [Theory]
    [InlineData(HourFormat.Numeric, "numeric")]
    [InlineData(HourFormat.TwoDigit, "2-digit")]
    public void NimbleTableColumnDateText_WithCustomHourAttribute_HasTableMarkup(HourFormat value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomHour, value);
        table.AssertAttribute("custom-hour", expectedAttributeValue);
    }

    [Theory]
    [InlineData(MinuteFormat.Numeric, "numeric")]
    [InlineData(MinuteFormat.TwoDigit, "2-digit")]
    public void NimbleTableColumnDateText_WithCustomMinuteAttribute_HasTableMarkup(MinuteFormat value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomMinute, value);
        table.AssertAttribute("custom-minute", expectedAttributeValue);
    }

    [Theory]
    [InlineData(SecondFormat.Numeric, "numeric")]
    [InlineData(SecondFormat.TwoDigit, "2-digit")]
    public void NimbleTableColumnDateText_WithCustomSecondAttribute_HasTableMarkup(SecondFormat value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomSecond, value);
        table.AssertAttribute("custom-second", expectedAttributeValue);
    }

    [Theory]
    [InlineData(TimeZoneNameFormat.Long, "long")]
    [InlineData(TimeZoneNameFormat.Short, "short")]
    [InlineData(TimeZoneNameFormat.LongGeneric, "longGeneric")]
    [InlineData(TimeZoneNameFormat.LongOffset, "longOffset")]
    [InlineData(TimeZoneNameFormat.ShortGeneric, "shortGeneric")]
    [InlineData(TimeZoneNameFormat.ShortOffset, "shortOffset")]
    public void NimbleTableColumnDateText_WithCustomTimeZoneNameAttribute_HasTableMarkup(TimeZoneNameFormat value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomTimeZoneName, value);
        table.AssertAttribute("custom-time-zone-name", expectedAttributeValue);
    }

    [Theory]
    [InlineData(FormatMatcherAlgorithm.BestFit, "best fit")]
    [InlineData(FormatMatcherAlgorithm.Basic, "basic")]
    public void NimbleTableColumnDateText_WithCustomFormatMatcherAttribute_HasTableMarkup(FormatMatcherAlgorithm value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomFormatMatcher, value);
        table.AssertAttribute("custom-format-matcher", expectedAttributeValue);
    }

    [Theory]
    [InlineData(null, null)]
    [InlineData(true, "true")]
    [InlineData(false, "false")]
    public void NimbleTableColumnDateText_WithCustomHour12Attribute_HasTableMarkup(bool? value, string? expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomHour12, value);
        table.AssertAttribute("custom-hour12", expectedAttributeValue);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomTimeZoneAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomTimeZone, "America/New York");

        table.AssertAttribute("custom-time-zone", "America/New York");
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomCalendarAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomCalendar, "hebrew");

        table.AssertAttribute("custom-calendar", "hebrew");
    }

    [Theory]
    [InlineData(DayPeriodFormat.Long, "long")]
    [InlineData(DayPeriodFormat.Short, "short")]
    [InlineData(DayPeriodFormat.Narrow, "narrow")]
    public void NimbleTableColumnDateText_WithCustomDayPeriodAttribute_HasTableMarkup(DayPeriodFormat value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomDayPeriod, value);
        table.AssertAttribute("custom-day-period", expectedAttributeValue);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomNumberingSystemAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomNumberingSystem, "latn");

        table.AssertAttribute("custom-numbering-system", "latn");
    }

    [Theory]
    [InlineData(DateStyle.Full, "full")]
    [InlineData(DateStyle.Medium, "medium")]
    [InlineData(DateStyle.Long, "long")]
    [InlineData(DateStyle.Short, "short")]
    public void NimbleTableColumnDateText_WithCustomDateStyleAttribute_HasTableMarkup(DateStyle value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomDateStyle, value);
        table.AssertAttribute("custom-date-style", expectedAttributeValue);
    }

    [Theory]
    [InlineData(TimeStyle.Full, "full")]
    [InlineData(TimeStyle.Medium, "medium")]
    [InlineData(TimeStyle.Long, "long")]
    [InlineData(TimeStyle.Short, "short")]
    public void NimbleTableColumnDateText_WithCustomTimeStyleAttribute_HasTableMarkup(TimeStyle value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomTimeStyle, value);
        table.AssertAttribute("custom-time-style", expectedAttributeValue);
    }

    [Theory]
    [InlineData(HourCycleFormat.H11, "h11")]
    [InlineData(HourCycleFormat.H12, "h12")]
    [InlineData(HourCycleFormat.H23, "h23")]
    [InlineData(HourCycleFormat.H24, "h24")]
    public void NimbleTableColumnDateText_WithCustomHourCycleAttribute_HasTableMarkup(HourCycleFormat value, string expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.CustomHourCycle, value);
        table.AssertAttribute("custom-hour-cycle", expectedAttributeValue);
    }

    private IRenderedComponent<NimbleTableColumnDateText> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnDateText, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleTableColumnDateText>(p => p.Add(propertyGetter, propertyValue));
    }
}

/// <summary>
/// Tests for NimbleTableColumn API on <see cref="NimbleTableColumnDateText"/>
/// </summary>
public class NimbleTableColumnDateTextBaseTests : NimbleTableColumnTests<NimbleTableColumnDateText>
{
}

/// <summary>
/// Tests for FractionalWidthAPI on <see cref="NimbleTableColumnDateText"/>
/// </summary>
public class NimbleTableColumnDateTextFractionalWidthTests : FractionalWidthBaseTests<NimbleTableColumnDateText>
{
}

/// <summary>
/// Tests for GroupableAPI on <see cref="NimbleTableColumnDateText"/>
/// </summary>
public class NimbleTableColumnDateTextGroupableTests : GroupableBaseTests<NimbleTableColumnDateText>
{
}

/// <summary>
/// Tests for SortableAPI on <see cref="NimbleTableColumnDateText"/>
/// </summary>
public class NimbleTableColumnDateTextSortableTests : SortableBaseTests<NimbleTableColumnDateText>
{
}
