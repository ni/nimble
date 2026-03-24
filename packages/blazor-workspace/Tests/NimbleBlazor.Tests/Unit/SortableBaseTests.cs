using System;
using System.Linq.Expressions;
using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit;

public abstract class SortableBaseTests<T> where T : ComponentBase, ISortableColumn
{
    [Fact]
    public void NimbleTableColumn_WithSortIndexAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.SortIndex!, 0);

        var expectedMarkup = @"sort-index=""0""";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    [Fact]
    public void NimbleTableColumn_WithSortDirectionAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.SortDirection!, TableColumnSortDirection.Descending);

        var expectedMarkup = @"sort-direction=""descending""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumn_WithSortingDisabledAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.SortingDisabled!, true);

        var expectedMarkup = @"sorting-disabled";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    private IRenderedComponent<T> RenderWithPropertySet<TProperty>(Expression<Func<T, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<T>(p => p.Add(propertyGetter, propertyValue));
    }
}