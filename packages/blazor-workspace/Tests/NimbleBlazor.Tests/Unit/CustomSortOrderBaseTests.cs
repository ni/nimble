using System;
using System.Linq.Expressions;
using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit;

public abstract class CustomSortOrderBaseTests<T> where T : ComponentBase, ICustomSortOrderColumn
{
    [Fact]
    public void NimbleTableColumn_WithSortByFieldNameAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.SortByFieldName!, "custom-sort-field-name");

        var expectedMarkup = @"sort-by-field-name=""custom-sort-field-name""";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    private IRenderedComponent<T> RenderWithPropertySet<TProperty>(Expression<Func<T, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<T>(p => p.Add(propertyGetter, propertyValue));
    }
}