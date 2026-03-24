using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit;

public abstract class NimbleTableColumnTests<T> where T : NimbleTableColumn
{
    [Fact]
    public void NimbleTableColumn_WithColumnIdAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.ColumnId!, "my-column-id");

        var expectedMarkup = @"column-id=""my-column-id""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumn_WithActionMenuSlotAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.ActionMenuSlot!, "my-slot");

        var expectedMarkup = @"action-menu-slot=""my-slot""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumn_WithActionMenuLabelAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.ActionMenuLabel!, "Cell actions");

        var expectedMarkup = @"action-menu-label=""Cell actions""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumn_WithColumnHiddenAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.ColumnHidden!, true);

        var expectedMarkup = "column-hidden";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    private IRenderedComponent<T> RenderWithPropertySet<TProperty>(Expression<Func<T, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<T>(p => p.Add(propertyGetter, propertyValue));
    }
}