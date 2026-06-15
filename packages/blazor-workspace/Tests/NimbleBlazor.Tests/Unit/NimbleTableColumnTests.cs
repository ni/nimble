using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;
namespace NimbleBlazor.Tests.Unit;

public abstract class NimbleTableColumnTests<T> : BunitTestBase where T : NimbleTableColumn
{
    [Fact]
    public void NimbleTableColumn_WithColumnIdAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.ColumnId!, "my-column-id");

        table.AssertAttribute("column-id", "my-column-id");
    }

    [Fact]
    public void NimbleTableColumn_WithActionMenuSlotAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.ActionMenuSlot!, "my-slot");

        table.AssertAttribute("action-menu-slot", "my-slot");
    }

    [Fact]
    public void NimbleTableColumn_WithActionMenuLabelAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.ActionMenuLabel!, "Cell actions");

        table.AssertAttribute("action-menu-label", "Cell actions");
    }

    [Fact]
    public void NimbleTableColumn_WithColumnHiddenAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.ColumnHidden!, true);

        table.AssertHasAttribute("column-hidden");
    }

    private IRenderedComponent<T> RenderWithPropertySet<TProperty>(Expression<Func<T, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<T>(p => p.Add(propertyGetter, propertyValue));
    }
}