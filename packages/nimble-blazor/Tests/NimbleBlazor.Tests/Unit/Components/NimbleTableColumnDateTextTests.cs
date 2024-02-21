using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnDateText"/>
/// </summary>
public class NimbleTableColumnDateTextTests
{
    [Fact]
    public void NimbleTableColumnDateText_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleTableColumnDateText>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FieldName!, "FirstName");

        var expectedMarkup = @"field-name=""FirstName""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Theory]
    [InlineData(DateTextFormat.Default, "<nimble-table-column-date-text((?!format).)*>")]
    [InlineData(DateTextFormat.Custom, @"format=""custom""")]
    public void NimbleTableColumnDateText_WithFormatAttribute_HasTableMarkup(DateTextFormat value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.Format, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(LocaleMatcherAlgorithm.BestFit, @"custom-locale-matcher=""best fit""")]
    [InlineData(LocaleMatcherAlgorithm.Lookup, @"custom-locale-matcher=""lookup""")]
    public void NimbleTableColumnDateText_WithCustomLocaleMatcherAttribute_HasTableMarkup(LocaleMatcherAlgorithm value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomLocaleMatcher, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(WeekdayFormat.Long, @"custom-weekday=""long""")]
    [InlineData(WeekdayFormat.Short, @"custom-weekday=""short""")]
    [InlineData(WeekdayFormat.Narrow, @"custom-weekday=""narrow""")]
    public void NimbleTableColumnDateText_WithCustomWeekdayAttribute_HasTableMarkup(WeekdayFormat value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomWeekday, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(EraFormat.Long, @"custom-era=""long""")]
    [InlineData(EraFormat.Short, @"custom-era=""short""")]
    [InlineData(EraFormat.Narrow, @"custom-era=""narrow""")]
    public void NimbleTableColumnDateText_WithCustomEraAttribute_HasTableMarkup(EraFormat value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomEra, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(YearFormat.Numeric, @"custom-year=""numeric""")]
    [InlineData(YearFormat.TwoDigit, @"custom-year=""2-digit""")]
    public void NimbleTableColumnDateText_WithCustomYearAttribute_HasTableMarkup(YearFormat value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomYear, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(MonthFormat.Numeric, @"custom-month=""numeric""")]
    [InlineData(MonthFormat.TwoDigit, @"custom-month=""2-digit""")]
    [InlineData(MonthFormat.Long, @"custom-month=""long""")]
    [InlineData(MonthFormat.Short, @"custom-month=""short""")]
    [InlineData(MonthFormat.Narrow, @"custom-month=""narrow""")]
    public void NimbleTableColumnDateText_WithCustomMonthAttribute_HasTableMarkup(MonthFormat value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomMonth, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(DayFormat.Numeric, @"custom-day=""numeric""")]
    [InlineData(DayFormat.TwoDigit, @"custom-day=""2-digit""")]
    public void NimbleTableColumnDateText_WithCustomDayAttribute_HasTableMarkup(DayFormat value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomDay, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(HourFormat.Numeric, @"custom-hour=""numeric""")]
    [InlineData(HourFormat.TwoDigit, @"custom-hour=""2-digit""")]
    public void NimbleTableColumnDateText_WithCustomHourAttribute_HasTableMarkup(HourFormat value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomHour, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(MinuteFormat.Numeric, @"custom-minute=""numeric""")]
    [InlineData(MinuteFormat.TwoDigit, @"custom-minute=""2-digit""")]
    public void NimbleTableColumnDateText_WithCustomMinuteAttribute_HasTableMarkup(MinuteFormat value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomMinute, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(SecondFormat.Numeric, @"custom-second=""numeric""")]
    [InlineData(SecondFormat.TwoDigit, @"custom-second=""2-digit""")]
    public void NimbleTableColumnDateText_WithCustomSecondAttribute_HasTableMarkup(SecondFormat value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomSecond, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(TimeZoneNameFormat.Long, @"custom-time-zone-name=""long""")]
    [InlineData(TimeZoneNameFormat.Short, @"custom-time-zone-name=""short""")]
    [InlineData(TimeZoneNameFormat.LongGeneric, @"custom-time-zone-name=""longGeneric""")]
    [InlineData(TimeZoneNameFormat.LongOffset, @"custom-time-zone-name=""longOffset""")]
    [InlineData(TimeZoneNameFormat.ShortGeneric, @"custom-time-zone-name=""shortGeneric""")]
    [InlineData(TimeZoneNameFormat.ShortOffset, @"custom-time-zone-name=""shortOffset""")]
    public void NimbleTableColumnDateText_WithCustomTimeZoneNameAttribute_HasTableMarkup(TimeZoneNameFormat value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomTimeZoneName, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(FormatMatcherAlgorithm.BestFit, @"custom-format-matcher=""best fit""")]
    [InlineData(FormatMatcherAlgorithm.Basic, @"custom-format-matcher=""basic""")]
    public void NimbleTableColumnDateText_WithCustomFormatMatcherAttribute_HasTableMarkup(FormatMatcherAlgorithm value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomFormatMatcher, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(null, "<nimble-table-column-date-text((?!custom-hour12).)*>")]
    [InlineData(true, @"custom-hour12=""true""")]
    [InlineData(false, @"custom-hour12=""false""")]
    public void NimbleTableColumnDateText_WithCustomHour12Attribute_HasTableMarkup(bool? value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomHour12, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomTimeZoneAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomTimeZone, "America/New York");

        var expectedMarkup = @"custom-time-zone=""America/New York""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomCalendarAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomCalendar, "hebrew");

        var expectedMarkup = @"custom-calendar=""hebrew""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Theory]
    [InlineData(DayPeriodFormat.Long, @"custom-day-period=""long""")]
    [InlineData(DayPeriodFormat.Short, @"custom-day-period=""short""")]
    [InlineData(DayPeriodFormat.Narrow, @"custom-day-period=""narrow""")]
    public void NimbleTableColumnDateText_WithCustomDayPeriodAttribute_HasTableMarkup(DayPeriodFormat value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomDayPeriod, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomNumberingSystemAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomNumberingSystem, "latn");

        var expectedMarkup = @"custom-numbering-system=""latn""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Theory]
    [InlineData(DateStyle.Full, @"custom-date-style=""full""")]
    [InlineData(DateStyle.Medium, @"custom-date-style=""medium""")]
    [InlineData(DateStyle.Long, @"custom-date-style=""long""")]
    [InlineData(DateStyle.Short, @"custom-date-style=""short""")]
    public void NimbleTableColumnDateText_WithCustomDateStyleAttribute_HasTableMarkup(DateStyle value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomDateStyle, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(TimeStyle.Full, @"custom-time-style=""full""")]
    [InlineData(TimeStyle.Medium, @"custom-time-style=""medium""")]
    [InlineData(TimeStyle.Long, @"custom-time-style=""long""")]
    [InlineData(TimeStyle.Short, @"custom-time-style=""short""")]
    public void NimbleTableColumnDateText_WithCustomTimeStyleAttribute_HasTableMarkup(TimeStyle value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomTimeStyle, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(HourCycleFormat.H11, @"custom-hour-cycle=""h11""")]
    [InlineData(HourCycleFormat.H12, @"custom-hour-cycle=""h12""")]
    [InlineData(HourCycleFormat.H23, @"custom-hour-cycle=""h23""")]
    [InlineData(HourCycleFormat.H24, @"custom-hour-cycle=""h24""")]
    public void NimbleTableColumnDateText_WithCustomHourCycleAttribute_HasTableMarkup(HourCycleFormat value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.CustomHourCycle, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    private IRenderedComponent<NimbleTableColumnDateText> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnDateText, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnDateText>(p => p.Add(propertyGetter, propertyValue));
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
