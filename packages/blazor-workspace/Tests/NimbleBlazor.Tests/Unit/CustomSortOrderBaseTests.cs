using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;
namespace NimbleBlazor.Tests.Unit;

public abstract class CustomSortOrderBaseTests<T> : BunitTestBase where T : ComponentBase, ICustomSortOrderColumn
{
    [Fact]
    public void NimbleTableColumn_WithSortByFieldNameAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.SortByFieldName!, "custom-sort-field-name");

        tableColumn.AssertAttribute("sort-by-field-name", "custom-sort-field-name");
    }

    private IRenderedComponent<T> RenderWithPropertySet<TProperty>(Expression<Func<T, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<T>(p => p.Add(propertyGetter, propertyValue));
    }
}