using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnDurationText"/>
/// </summary>
public class NimbleTableColumnDurationTextTests : BunitTestBase
{
    [Fact]
    public void NimbleTableColumnDurationText_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleTableColumnDurationText>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnDurationText_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FieldName!, "MyDuration");

        table.AssertAttribute("field-name", "MyDuration");
    }

    [Fact]
    public void NimbleTableColumnDurationText_WithPlaceholderAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.Placeholder, "Custom placeholder");

        table.AssertAttribute("placeholder", "Custom placeholder");
    }

    private IRenderedComponent<NimbleTableColumnDurationText> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnDurationText, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleTableColumnDurationText>(p => p.Add(propertyGetter, propertyValue));
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

/// <summary>
/// Tests for SortableAPI on <see cref="NimbleTableColumnDurationText"/>
/// </summary>
public class NimbleTableColumnDurationTextSortableTests : SortableBaseTests<NimbleTableColumnDurationText>
{
}
