using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnMenuButton"/>
/// </summary>
public class NimbleTableColumnMenuButtonTests : BunitTestBase
{
    [Fact]
    public void NimbleTableColumnMenuButton_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleTableColumnMenuButton>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnMenuButton_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FieldName!, "MyField");

        table.AssertAttribute("field-name", "MyField");
    }

    [Fact]
    public void NimbleTableColumnMenuButton_WithMenuSlotAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.MenuSlot!, "MyMenuSlot");

        table.AssertAttribute("menu-slot", "MyMenuSlot");
    }

    private IRenderedComponent<NimbleTableColumnMenuButton> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnMenuButton, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleTableColumnMenuButton>(p => p.Add(propertyGetter, propertyValue));
    }
}

/// <summary>
/// Tests for NimbleTableColumn API on <see cref="NimbleTableColumnMenuButton"/>
/// </summary>
public class NimbleTableColumnMenuButtonBaseTests : NimbleTableColumnTests<NimbleTableColumnMenuButton>
{
}

/// <summary>
/// Tests for FractionalWidthAPI on <see cref="NimbleTableColumnMenuButton"/>
/// </summary>
public class NimbleTableColumnMenuButtonFractionalWidthTests : FractionalWidthBaseTests<NimbleTableColumnMenuButton>
{
}
