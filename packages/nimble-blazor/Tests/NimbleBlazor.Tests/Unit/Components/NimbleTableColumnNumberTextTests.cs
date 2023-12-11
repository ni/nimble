using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnNumberText"/>
/// </summary>
public class NimbleTableColumnNumberTextTests
{
    [Fact]
    public void NimbleTableColumnNumberText_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleTableColumnNumberText>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnNumberText_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FieldName!, "FirstName");

        var expectedMarkup = @"field-name=""FirstName""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnNumberText_WithDecimalDigitsAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.DecimalDigits!, 5);

        var expectedMarkup = @"decimal-digits=""5""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnNumberText_WithDecimalMaximumDigitsAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.DecimalMaximumDigits!, 5);

        var expectedMarkup = @"decimal-maximum-digits=""5""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Theory]
    [InlineData(NumberTextFormat.Default, "<nimble-table-column-number-text((?!format).)*>")]
    [InlineData(NumberTextFormat.Decimal, @"format=""decimal""")]
    public void NimbleTableColumnNumberText_WithFormatAttribute_HasTableMarkup(NumberTextFormat value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.Format, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    [Theory]
    [InlineData(NumberTextAlignment.Default, @"<nimble-table-column-number-text((?!alignment).)*>")]
    [InlineData(NumberTextAlignment.Left, @"alignment=""left""")]
    [InlineData(NumberTextAlignment.Right, @"alignment=""right""")]
    public void NimbleTableColumnNumberText_WithCustomLocaleMatcherAttribute_HasTableMarkup(NumberTextAlignment value, string expectedMarkupRegEx)
    {
        var table = RenderWithPropertySet(x => x.Alignment, value);
        Assert.Matches(expectedMarkupRegEx, table.Markup);
    }

    private IRenderedComponent<NimbleTableColumnNumberText> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnNumberText, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnNumberText>(p => p.Add(propertyGetter, propertyValue));
    }
}

/// <summary>
/// Tests for NimbleTableColumn API on <see cref="NimbleTableColumnNumberText"/>
/// </summary>
public class NimbleTableColumnNumberTextBaseTests : NimbleTableColumnTests<NimbleTableColumnNumberText>
{
}

/// <summary>
/// Tests for FractionalWidthAPI on <see cref="NimbleTableColumnNumberText"/>
/// </summary>
public class NimbleTableColumnNumberTextFractionalWidthTests : FractionalWidthBaseTests<NimbleTableColumnNumberText>
{
}

/// <summary>
/// Tests for GroupableAPI on <see cref="NimbleTableColumnNumberText"/>
/// </summary>
public class NimbleTableColumnNumberTextGroupableTests : GroupableBaseTests<NimbleTableColumnNumberText>
{
}
