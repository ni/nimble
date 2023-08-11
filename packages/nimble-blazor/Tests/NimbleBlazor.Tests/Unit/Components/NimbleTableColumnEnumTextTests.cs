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
        var exception = Record.Exception(() => context.RenderComponent<NimbleTableColumnEnumText<int>>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithIntTypeParameter_HasNumberMarkup()
    {
        var column = Render<int>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithUIntTypeParameter_HasNumberMarkup()
    {
        var column = Render<uint>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithShortTypeParameter_HasNumberMarkup()
    {
        var column = Render<short>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithUShortTypeParameter_HasNumberMarkup()
    {
        var column = Render<ushort>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithLongTypeParameter_HasNumberMarkup()
    {
        var column = Render<long>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithULongTypeParameter_HasNumberMarkup()
    {
        var column = Render<ulong>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithByteTypeParameter_HasNumberMarkup()
    {
        var column = Render<byte>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithSByteTypeParameter_HasNumberMarkup()
    {
        var column = Render<sbyte>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithFloatTypeParameter_HasNumberMarkup()
    {
        var column = Render<float>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithDoubleTypeParameter_HasNumberMarkup()
    {
        var column = Render<double>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithDecimalTypeParameter_HasNumberMarkup()
    {
        var column = Render<decimal>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithBooleanTypeParameter_HasBooleanMarkup()
    {
        var column = Render<bool>();

        var expectedMarkup = @"key-type=""boolean""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithStringTypeParameter_HasStringMarkup()
    {
        var column = Render<string>();

        var expectedMarkup = @"key-type=""string""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithObjectTypeParameter_ThrowsException()
    {
        Assert.Throws<ArgumentException>(() => Render<object>());
    }

    [Fact]
    public void NimbleTableColumnEnumText_WithFieldNameAttribute_HasMarkup()
    {
        var column = RenderWithPropertySet<int, string>(x => x.FieldName!, "Status");

        var expectedMarkup = @"field-name=""Status""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    private IRenderedComponent<NimbleTableColumnEnumText<TKey>> Render<TKey>()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnEnumText<TKey>>();
    }

    private IRenderedComponent<NimbleTableColumnEnumText<TKey>> RenderWithPropertySet<TKey, TProperty>(Expression<Func<NimbleTableColumnEnumText<TKey>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnEnumText<TKey>>(p => p.Add(propertyGetter, propertyValue));
    }
}

/// <summary>
/// Tests for NimbleTableColumn API on <see cref="NimbleTableColumnEnumText"/>
/// </summary>
public class NimbleTableColumnEnumTextBaseTests : NimbleTableColumnTests<NimbleTableColumnEnumText<int>>
{
}

/// <summary>
/// Tests for FractionalWidthAPI on <see cref="NimbleTableColumnEnumText"/>
/// </summary>
public class NimbleTableColumnEnumTextFractionalWidthTests : FractionalWidthBaseTests<NimbleTableColumnEnumText<int>>
{
}

/// <summary>
/// Tests for GroupableAPI on <see cref="NimbleTableColumnEnumText"/>
/// </summary>
public class NimbleTableColumnEnumTextGroupableTests : GroupableBaseTests<NimbleTableColumnEnumText<int>>
{
}
