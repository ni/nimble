using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnDurationText"/>
/// </summary>
public class NimbleTableColumnDurationTextTests
{
    [Fact]
    public void NimbleTableColumnDurationText_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleTableColumnDurationText>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnDurationText_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FieldName!, "MyDuration");

        var expectedMarkup = @"field-name=""MyDuration""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    private IRenderedComponent<NimbleTableColumnDurationText> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnDurationText, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnDurationText>(p => p.Add(propertyGetter, propertyValue));
    }
}

/// <summary>
/// Tests for NimbleTableColumn API on <see cref="NimbleTableColumnDurationText"/>
/// </summary>
public class NimbleTableColumnDurationTextBaseTests : NimbleTableColumnTests<NimbleTableColumnDurationText>
{
}

/// <summary>
/// Tests for FractionalWidthAPI on <see cref="NimbleTableColumnDurationText"/>
/// </summary>
public class NimbleTableColumnDurationTextFractionalWidthTests : FractionalWidthBaseTests<NimbleTableColumnDurationText>
{
}

/// <summary>
/// Tests for GroupableAPI on <see cref="NimbleTableColumnDurationText"/>
/// </summary>
public class NimbleTableColumnDurationTextGroupableTests : GroupableBaseTests<NimbleTableColumnDurationText>
{
}
