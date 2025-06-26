using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnMenuButton"/>
/// </summary>
public class NimbleTableColumnMenuButtonTests
{
    [Fact]
    public void NimbleTableColumnMenuButton_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleTableColumnMenuButton>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnMenuButton_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FieldName!, "MyField");

        var expectedMarkup = @"field-name=""MyField""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnMenuButton_WithMenuSlotAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.MenuSlot!, "MyMenuSlot");

        var expectedMarkup = @"menu-slot=""MyMenuSlot""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    private IRenderedComponent<NimbleTableColumnMenuButton> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnMenuButton, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnMenuButton>(p => p.Add(propertyGetter, propertyValue));
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
