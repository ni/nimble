using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnEnumText"/>
/// </summary>
public class NimbleTableColumnEnumTextTests
{
    [Fact]
    public void NimbleTableColumnEnumText_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleTableColumnEnumText>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FieldName!, "Status");

        var expectedMarkup = @"field-name=""Status""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithKeyTypeAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.KeyType!, MappingKeyType.Boolean);

        var expectedMarkup = @"key-type=""boolean""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    private IRenderedComponent<NimbleTableColumnEnumText> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnEnumText, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnEnumText>(p => p.Add(propertyGetter, propertyValue));
    }
}

/// <summary>
/// Tests for NimbleTableColumn API on <see cref="NimbleTableColumnEnumText"/>
/// </summary>
public class NimbleTableColumnEnumTextBaseTests : NimbleTableColumnTests<NimbleTableColumnEnumText>
{
}

/// <summary>
/// Tests for FractionalWidthAPI on <see cref="NimbleTableColumnEnumText"/>
/// </summary>
public class NimbleTableColumnEnumTextFractionalWidthTests : FractionalWidthBaseTests<NimbleTableColumnEnumText>
{
}

/// <summary>
/// Tests for GroupableAPI on <see cref="NimbleTableColumnEnumText"/>
/// </summary>
public class NimbleTableColumnEnumTextGroupableTests : GroupableBaseTests<NimbleTableColumnEnumText>
{
}
