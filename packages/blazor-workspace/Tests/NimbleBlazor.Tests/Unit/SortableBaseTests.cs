using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit;

public abstract class SortableBaseTests<T> : BunitTestBase where T : ComponentBase, ISortableColumn
{
    [Fact]
    public void NimbleTableColumn_WithSortIndexAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.SortIndex!, 0);

        tableColumn.AssertAttribute("sort-index", "0");
    }

    [Fact]
    public void NimbleTableColumn_WithSortDirectionAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.SortDirection!, TableColumnSortDirection.Descending);

        table.AssertAttribute("sort-direction", "descending");
    }

    [Fact]
    public void NimbleTableColumn_WithSortingDisabledAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.SortingDisabled!, true);

        tableColumn.AssertHasAttribute("sorting-disabled");
    }

    private IRenderedComponent<T> RenderWithPropertySet<TProperty>(Expression<Func<T, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<T>(p => p.Add(propertyGetter, propertyValue));
    }
}