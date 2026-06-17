using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnMapping"/>
/// </summary>
public class NimbleTableColumnMappingTests : BunitTestBase
{
    [Fact]
    public void NimbleTableColumnMapping_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleTableColumnMapping<int>>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithIntTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<int>();

        column.AssertAttribute("key-type", "number");
    }

    [Fact]
    public void NimbleTableColumnMapping_WithUIntTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<uint>();

        column.AssertAttribute("key-type", "number");
    }

    [Fact]
    public void NimbleTableColumnMapping_WithShortTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<short>();

        column.AssertAttribute("key-type", "number");
    }

    [Fact]
    public void NimbleTableColumnMapping_WithUShortTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<ushort>();

        column.AssertAttribute("key-type", "number");
    }

    [Fact]
    public void NimbleTableColumnMapping_WithLongTypeParameter_ThrowsException()
    {
        Assert.Throws<ArgumentException>(RenderTableEnumColumn<long>);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithULongTypeParameter_ThrowsException()
    {
        Assert.Throws<ArgumentException>(RenderTableEnumColumn<ulong>);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithByteTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<byte>();

        column.AssertAttribute("key-type", "number");
    }

    [Fact]
    public void NimbleTableColumnMapping_WithSByteTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<sbyte>();

        column.AssertAttribute("key-type", "number");
    }

    [Fact]
    public void NimbleTableColumnMapping_WithFloatTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<float>();

        column.AssertAttribute("key-type", "number");
    }

    [Fact]
    public void NimbleTableColumnMapping_WithDoubleTypeParameter_HasNumberMarkup()
    {
        var column = RenderTableEnumColumn<double>();

        column.AssertAttribute("key-type", "number");
    }

    [Fact]
    public void NimbleTableColumnMapping_WithDecimalTypeParameter_ThrowsException()
    {
        Assert.Throws<ArgumentException>(RenderTableEnumColumn<decimal>);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithBooleanTypeParameter_HasBooleanMarkup()
    {
        var column = RenderTableEnumColumn<bool>();

        column.AssertAttribute("key-type", "boolean");
    }

    [Fact]
    public void NimbleTableColumnMapping_WithStringTypeParameter_HasStringMarkup()
    {
        var column = RenderTableEnumColumn<string>();

        column.AssertAttribute("key-type", "string");
    }

    [Fact]
    public void NimbleTableColumnMapping_WithObjectTypeParameter_ThrowsException()
    {
        Assert.Throws<ArgumentException>(RenderTableEnumColumn<object>);
    }

    [Fact]
    public void NimbleTableColumnMapping_WithFieldNameAttribute_HasMarkup()
    {
        var column = RenderWithPropertySet<int, string>(x => x.FieldName!, "Status");

        column.AssertAttribute("field-name", "Status");
    }

    [Fact]
    public void NimbleTableColumnMapping_WithWidthModeAttribute_HasMarkup()
    {
        var column = RenderWithPropertySet<int, MappingColumnWidthMode?>(x => x.WidthMode, MappingColumnWidthMode.IconSize);

        column.AssertAttribute("width-mode", "icon-size");
    }

    private IRenderedComponent<NimbleTableColumnMapping<TKey>> RenderTableEnumColumn<TKey>()
    {
        return Render<NimbleTableColumnMapping<TKey>>();
    }

    private IRenderedComponent<NimbleTableColumnMapping<TKey>> RenderWithPropertySet<TKey, TProperty>(Expression<Func<NimbleTableColumnMapping<TKey>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleTableColumnMapping<TKey>>(p => p.Add(propertyGetter, propertyValue));
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
