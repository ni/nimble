using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit;

public abstract class NimbleTableColumnTests<T> where T : NimbleTableColumn
{
    [Fact]
    public void NimbleTableColumn_WithSortIndexAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.SortIndex!, 0);

        var expectedMarkup = @"sort-index=""0""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumn_WithSortDirectionAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.SortDirection!, TableColumnSortDirection.Descending);

        var expectedMarkup = @"sort-direction=""descending""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    private IRenderedComponent<T> RenderWithPropertySet<TProperty>(Expression<Func<T, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<T>(p => p.Add(propertyGetter, propertyValue));
    }
}