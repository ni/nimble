using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextTests : BunitTestBase
{
    [Fact]
    public void NimbleTableColumnText_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleTableColumnText>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnText_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FieldName!, "FirstName");

        table.AssertAttribute("field-name", "FirstName");
    }

    [Fact]
    public void NimbleTableColumnText_WithPlaceholderAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.Placeholder, "Custom placeholder");

        table.AssertAttribute("placeholder", "Custom placeholder");
    }

    private IRenderedComponent<NimbleTableColumnText> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnText, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleTableColumnText>(p => p.Add(propertyGetter, propertyValue));
    }
}

/// <summary>
/// Tests for NimbleTableColumn API on <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextBaseTests : NimbleTableColumnTests<NimbleTableColumnText>
{
}

/// <summary>
/// Tests for FractionalWidthAPI on <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextFractionalWidthTests : FractionalWidthBaseTests<NimbleTableColumnText>
{
}

/// <summary>
/// Tests for GroupableAPI on <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextGroupableTests : GroupableBaseTests<NimbleTableColumnText>
{
}

/// <summary>
/// Tests for SortableAPI on <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextSortableTests : SortableBaseTests<NimbleTableColumnText>
{
}

/// <summary>
/// Tests for CustomSortOrderAPI on <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextCustomSortOrderTests : CustomSortOrderBaseTests<NimbleTableColumnText>
{
}
