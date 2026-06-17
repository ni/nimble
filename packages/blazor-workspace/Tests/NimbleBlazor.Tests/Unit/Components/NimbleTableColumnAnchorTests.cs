using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnAnchor"/>
/// </summary>
public class NimbleTableColumnAnchorTests : BunitTestBase
{
    [Fact]
    public void NimbleTableColumnAnchor_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleTableColumnAnchor>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithLabelFieldNameAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.LabelFieldName!, "FirstName");

        tableColumn.AssertAttribute("label-field-name", "FirstName");
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithHrefFieldNameAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.HrefFieldName!, "Link");

        tableColumn.AssertAttribute("href-field-name", "Link");
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithAppearanceAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.Appearance!, AnchorAppearance.Prominent);

        tableColumn.AssertAttribute("appearance", "prominent");
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithPlaceholderAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.Placeholder, "Custom placeholder");

        table.AssertAttribute("placeholder", "Custom placeholder");
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithUnderlineHiddenAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.UnderlineHidden, true);

        tableColumn.AssertHasAttribute("underline-hidden");
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithHrefLangAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.HrefLang!, "en");

        tableColumn.AssertAttribute("hreflang", "en");
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithPingAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.Ping!, "foo");

        tableColumn.AssertAttribute("ping", "foo");
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithReferrerPolicyAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.ReferrerPolicy!, "foo");

        tableColumn.AssertAttribute("referrerpolicy", "foo");
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithRelAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.Rel!, "foo");

        tableColumn.AssertAttribute("rel", "foo");
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithTargetAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.Target!, "foo");

        tableColumn.AssertAttribute("target", "foo");
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithTypeAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.Type!, "foo");

        tableColumn.AssertAttribute("type", "foo");
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithDownloadAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.Download!, "foo");

        tableColumn.AssertAttribute("download", "foo");
    }

    private IRenderedComponent<NimbleTableColumnAnchor> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnAnchor, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleTableColumnAnchor>(p => p.Add(propertyGetter, propertyValue));
    }
}

/// <summary>
/// Tests for NimbleTableColumn API on <see cref="NimbleTableColumnAnchor"/>
/// </summary>
public class NimbleTableColumnAnchorBaseTests : NimbleTableColumnTests<NimbleTableColumnAnchor>
{
}

/// <summary>
/// Tests for FractionalWidthAPI on <see cref="NimbleTableColumnAnchor"/>
/// </summary>
public class NimbleTableColumnAnchorFractionalWidthTests : FractionalWidthBaseTests<NimbleTableColumnAnchor>
{
}

/// <summary>
/// Tests for GroupableAPI on <see cref="NimbleTableColumnAnchor"/>
/// </summary>
public class NimbleTableColumnAnchorGroupableTests : GroupableBaseTests<NimbleTableColumnAnchor>
{
}

/// <summary>
/// Tests for SortableAPI on <see cref="NimbleTableColumnAnchor"/>
/// </summary>
public class NimbleTableColumnAnchorSortableTests : SortableBaseTests<NimbleTableColumnAnchor>
{
}

/// <summary>
/// Tests for CustomSortOrderAPI on <see cref="NimbleTableColumnAnchor"/>
/// </summary>
public class NimbleTableColumnAnchorCustomSortOrderTests : CustomSortOrderBaseTests<NimbleTableColumnAnchor>
{
}
