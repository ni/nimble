using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;
using Microsoft.AspNetCore.Components;
#nullable enable
namespace NimbleBlazor.Tests.Unit;

public abstract class GroupableBaseTests<T> where T : ComponentBase, GroupableColumn
{
    protected void NimbleTableColumn_WithGroupIndexAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.GroupIndex!, 0);

        var expectedMarkup = @"group-index=""0""";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    protected void NimbleTableColumn_WithGroupingDisabledAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.GroupingDisabled!, true);

        var expectedMarkup = @"grouping-disabled";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    private IRenderedComponent<T> RenderWithPropertySet<TProperty>(Expression<Func<T, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<T>(p => p.Add(propertyGetter, propertyValue));
    }
}