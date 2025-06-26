using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnMapping"/>
/// </summary>
public class NimbleTableColumnMappingTests
{
    [Fact]
    public void NimbleTableColumnMapping_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleTableColumnMapping<int>>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithIntTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<int>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithUIntTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<uint>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithShortTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<short>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithUShortTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<ushort>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithLongTypeParameter_ThrowsException()
    {
        Assert.Throws<ArgumentException>(() => RenderTableEnumColumn<long>());
    }

    [Fact]
    public void NimbleTableColumnMapping_WithULongTypeParameter_ThrowsException()
    {
        Assert.Throws<ArgumentException>(() => RenderTableEnumColumn<ulong>());
    }

    [Fact]
    public void NimbleTableColumnMapping_WithByteTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<byte>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithSByteTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<sbyte>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithFloatTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<float>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithDoubleTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<double>();

        var expectedMarkup = @"key-type=""number""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithDecimalTypeParameter_ThrowsException()
    {
        Assert.Throws<ArgumentException>(() => RenderTableEnumColumn<decimal>());
    }

    [Fact]
    public void NimbleTableColumnMapping_WithBooleanTypeParameter_HasBooleanMarkup()
    {
        var column = RenderTableEnumColumn<bool>();

        var expectedMarkup = @"key-type=""boolean""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithStringTypeParameter_HasStringMarkup()
    {
        var column = RenderTableEnumColumn<string>();

        var expectedMarkup = @"key-type=""string""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithObjectTypeParameter_ThrowsException()
    {
        Assert.Throws<ArgumentException>(() => RenderTableEnumColumn<object>());
    }

    [Fact]
    public void NimbleTableColumnMapping_WithFieldNameAttribute_HasMarkup()
    {
        var column = RenderWithPropertySet<int, string>(x => x.FieldName!, "Status");

        var expectedMarkup = @"field-name=""Status""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithWidthModeAttribute_HasMarkup()
    {
        var column = RenderWithPropertySet<int, MappingColumnWidthMode?>(x => x.WidthMode, MappingColumnWidthMode.IconSize);

        var expectedMarkup = @"width-mode=""icon-size""";
        Assert.Contains(expectedMarkup, column.Markup);
    }

    private IRenderedComponent<NimbleTableColumnMapping<TKey>> RenderTableEnumColumn<TKey>()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnMapping<TKey>>();
    }

    private IRenderedComponent<NimbleTableColumnMapping<TKey>> RenderWithPropertySet<TKey, TProperty>(Expression<Func<NimbleTableColumnMapping<TKey>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnMapping<TKey>>(p => p.Add(propertyGetter, propertyValue));
    }
}

/// <summary>
/// Tests for NimbleTableColumn API on <see cref="NimbleTableColumnMapping"/>
/// </summary>
public class NimbleTableColumnMappingBaseTests : NimbleTableColumnTests<NimbleTableColumnMapping<int>>
{
}

/// <summary>
/// Tests for FractionalWidthAPI on <see cref="NimbleTableColumnMapping"/>
/// </summary>
public class NimbleTableColumnMappingFractionalWidthTests : FractionalWidthBaseTests<NimbleTableColumnMapping<int>>
{
}

/// <summary>
/// Tests for GroupableAPI on <see cref="NimbleTableColumnMapping"/>
/// </summary>
public class NimbleTableColumnMappingGroupableTests : GroupableBaseTests<NimbleTableColumnMapping<int>>
{
}

/// <summary>
/// Tests for SortableAPI on <see cref="NimbleTableColumnMapping"/>
/// </summary>
public class NimbleTableColumnMappingSortableTests : SortableBaseTests<NimbleTableColumnMapping<int>>
{
}
