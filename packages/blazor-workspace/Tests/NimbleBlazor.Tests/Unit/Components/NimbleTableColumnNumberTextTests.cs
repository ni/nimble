using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnNumberText"/>
/// </summary>
public class NimbleTableColumnNumberTextTests : BunitTestBase
{
    [Fact]
    public void NimbleTableColumnNumberText_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleTableColumnNumberText>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnNumberText_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FieldName!, "FirstName");

        table.AssertAttribute("field-name", "FirstName");
    }

    [Fact]
    public void NimbleTableColumnNumberText_WithPlaceholderAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.Placeholder, "Custom placeholder");

        table.AssertAttribute("placeholder", "Custom placeholder");
    }

    [Fact]
    public void NimbleTableColumnNumberText_WithDecimalDigitsAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.DecimalDigits!, 5);

        table.AssertAttribute("decimal-digits", "5");
    }

    [Fact]
    public void NimbleTableColumnNumberText_WithDecimalMaximumDigitsAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.DecimalMaximumDigits!, 5);

        table.AssertAttribute("decimal-maximum-digits", "5");
    }

    [Theory]
    [InlineData(NumberTextFormat.Default, null)]
    [InlineData(NumberTextFormat.Decimal, "decimal")]
    public void NimbleTableColumnNumberText_WithFormatAttribute_HasTableMarkup(NumberTextFormat value, string? expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.Format, value);
        table.AssertAttribute("format", expectedAttributeValue);
    }

    [Theory]
    [InlineData(NumberTextAlignment.Default, null)]
    [InlineData(NumberTextAlignment.Left, "left")]
    [InlineData(NumberTextAlignment.Right, "right")]
    public void NimbleTableColumnNumberText_WithCustomLocaleMatcherAttribute_HasTableMarkup(NumberTextAlignment value, string? expectedAttributeValue)
    {
        var table = RenderWithPropertySet(x => x.Alignment, value);
        table.AssertAttribute("alignment", expectedAttributeValue);
    }

    private IRenderedComponent<NimbleTableColumnNumberText> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnNumberText, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleTableColumnNumberText>(p => p.Add(propertyGetter, propertyValue));
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

/// <summary>
/// Tests for SortableAPI on <see cref="NimbleTableColumnNumberText"/>
/// </summary>
public class NimbleTableColumnNumberTextSortableTests : SortableBaseTests<NimbleTableColumnNumberText>
{
}
