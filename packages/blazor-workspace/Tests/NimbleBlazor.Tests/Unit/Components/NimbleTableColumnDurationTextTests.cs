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
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<NimbleTableColumnDurationText>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnDurationText_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FieldName!, "MyDuration");

        var expectedMarkup = @"field-name=""MyDuration""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnDurationText_WithPlaceholderAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.Placeholder, "Custom placeholder");

        var expectedMarkup = @"placeholder=""Custom placeholder""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    private IRenderedComponent<NimbleTableColumnDurationText> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnDurationText, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.Render<NimbleTableColumnDurationText>(p => p.Add(propertyGetter, propertyValue));
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
