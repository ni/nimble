using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit;

public abstract class GroupableBaseTests<T> : BunitTestBase where T : ComponentBase, IGroupableColumn
{
    [Fact]
    public void NimbleTableColumn_WithGroupIndexAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.GroupIndex!, 0);

        tableColumn.AssertAttribute("group-index", "0");
    }

    [Fact]
    public void NimbleTableColumn_WithGroupingDisabledAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.GroupingDisabled!, true);

        tableColumn.AssertHasAttribute("grouping-disabled");
    }

    private IRenderedComponent<T> RenderWithPropertySet<TProperty>(Expression<Func<T, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<T>(p => p.Add(propertyGetter, propertyValue));
    }
}