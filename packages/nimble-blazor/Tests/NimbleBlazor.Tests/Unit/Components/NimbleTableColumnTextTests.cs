using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextTests
{
    [Fact]
    public void NimbleTableColumnText_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FieldName!, "FirstName");

        var expectedMarkup = @"field-name=""FirstName""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnText_WithPlaceholderAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.Placeholder!, "No Value");

        var expectedMarkup = @"placeholder=""No Value""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnText_WithFractionalWidthAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FractionalWidth!, 2);

        var expectedMarkup = @"fractional-width=""2""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnText_WithMinPixelWidthAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.MinPixelWidth!, 40);

        var expectedMarkup = @"min-pixel-width=""40""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnText_WithSortIndexAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.SortIndex!, 0);

        var expectedMarkup = @"sort-index=""0""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnText_WithSortDirectionAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.SortDirection!, TableColumnSortDirection.Descending);

        var expectedMarkup = @"sort-direction=""descending""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnText_WithGroupIndexAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.GroupIndex!, 0);

        var expectedMarkup = @"group-index=""0""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnText_WithGroupingDisabledAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.GroupingDisabled!, true);

        var expectedMarkup = @"grouping-disabled";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    private IRenderedComponent<NimbleTableColumnText> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnText, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnText>(p => p.Add(propertyGetter, propertyValue));
    }
}
