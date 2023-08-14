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

    [Fact]
    public void NimbleTableColumnDateText_WithFormatAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.Format, DateTextFormat.Custom);

        var expectedMarkup = @"format=""custom""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomLocaleMatcherAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomLocaleMatcher, LocaleMatcherAlgorithm.Lookup);

        var expectedMarkup = @"custom-locale-matcher=""lookup""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomWeekdayAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomWeekday, WeekdayFormat.Narrow);

        var expectedMarkup = @"custom-weekday=""narrow""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomEraAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomEra, EraFormat.Short);

        var expectedMarkup = @"custom-era=""short""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomYearAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomYear, YearFormat.TwoDigit);

        var expectedMarkup = @"custom-year=""2-digit""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomMonthAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomMonth, MonthFormat.Long);

        var expectedMarkup = @"custom-month=""long""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomDayAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomDay, DayFormat.Numeric);

        var expectedMarkup = @"custom-day=""numeric""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomHourAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomHour, HourFormat.Numeric);

        var expectedMarkup = @"custom-hour=""numeric""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomMinuteAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomMinute, MinuteFormat.TwoDigit);

        var expectedMarkup = @"custom-minute=""2-digit""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomSecondAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomSecond, SecondFormat.Numeric);

        var expectedMarkup = @"custom-second=""numeric""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomTimeZoneNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomTimeZoneName, TimeZoneNameFormat.ShortGeneric);

        var expectedMarkup = @"custom-time-zone-name=""shortGeneric""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomFormatMatcherAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomFormatMatcher, FormatMatcherAlgorithm.Basic);

        var expectedMarkup = @"custom-format-matcher=""basic""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomHour12Attribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomHour12, false);

        var expectedMarkup = @"custom-hour12=""false""";
        Assert.Contains(expectedMarkup, table.Markup);
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

    [Fact]
    public void NimbleTableColumnDateText_WithCustomDayPeriodAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomDayPeriod, DayPeriodFormat.Narrow);

        var expectedMarkup = @"custom-day-period=""narrow""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomNumberingSystemAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomNumberingSystem, "latn");

        var expectedMarkup = @"custom-numbering-system=""latn""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomDateStyleAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomDateStyle, DateStyle.Medium);

        var expectedMarkup = @"custom-date-style=""medium""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomTimeStyleAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomTimeStyle, TimeStyle.Long);

        var expectedMarkup = @"custom-time-style=""long""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDateText_WithCustomHourCycleAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.CustomHourCycle, HourCycleFormat.H23);

        var expectedMarkup = @"custom-hour-cycle=""h23""";
        Assert.Contains(expectedMarkup, table.Markup);
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
