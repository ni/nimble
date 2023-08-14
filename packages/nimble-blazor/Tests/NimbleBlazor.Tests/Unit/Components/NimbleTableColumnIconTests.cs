using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnIcon"/>
/// </summary>
public class NimbleTableColumnIconTests
{
    [Fact]
    public void NimbleTableColumnIcon_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleTableColumnIcon<int>>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnIcon_WithIntTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<int>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnIcon_WithUIntTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<uint>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnIcon_WithShortTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<short>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnIcon_WithUShortTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<ushort>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnIcon_WithLongTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<long>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnIcon_WithULongTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<ulong>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnIcon_WithByteTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<byte>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnIcon_WithSByteTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<sbyte>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnIcon_WithFloatTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<float>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnIcon_WithDoubleTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<double>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnIcon_WithDecimalTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<decimal>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnIcon_WithBooleanTypeParameter_HasBooleanMarkup()
    {
        var column = RenderTableEnumColumn<bool>();

        var expectedMarkup = @"key-type=""boolean""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnIcon_WithStringTypeParameter_HasStringMarkup()
    {
        var column = RenderTableEnumColumn<string>();

        var expectedMarkup = @"key-type=""string""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnIcon_WithObjectTypeParameter_ThrowsException()
    {
        Assert.Throws<ArgumentException>(() => RenderTableEnumColumn<object>());
    }

    [Fact]
    public void NimbleTableColumnIcon_WithFieldNameAttribute_HasMarkup()
    {
        var column = RenderWithPropertySet<int, string>(x => x.FieldName!, "Status");

        var expectedMarkup = @"field-name=""Status""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    private IRenderedComponent<NimbleTableColumnIcon<TKey>> RenderTableEnumColumn<TKey>()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnIcon<TKey>>();
    }

    private IRenderedComponent<NimbleTableColumnIcon<TKey>> RenderWithPropertySet<TKey, TProperty>(Expression<Func<NimbleTableColumnIcon<TKey>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnIcon<TKey>>(p => p.Add(propertyGetter, propertyValue));
    }
}

/// <summary>
/// Tests for NimbleTableColumn API on <see cref="NimbleTableColumnIcon"/>
/// </summary>
public class NimbleTableColumnIconBaseTests : NimbleTableColumnTests<NimbleTableColumnIcon<int>>
{
}

/// <summary>
/// Tests for FractionalWidthAPI on <see cref="NimbleTableColumnIcon"/>
/// </summary>
public class NimbleTableColumnIconFractionalWidthTests : FractionalWidthBaseTests<NimbleTableColumnIcon<int>>
{
}

/// <summary>
/// Tests for GroupableAPI on <see cref="NimbleTableColumnIcon"/>
/// </summary>
public class NimbleTableColumnIconGroupableTests : GroupableBaseTests<NimbleTableColumnIcon<int>>
{
}
