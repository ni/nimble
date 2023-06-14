﻿using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnAnchor"/>
/// </summary>
public class NimbleTableColumnAnchorTests
{
    [Fact]
    public void NimbleTableColumnAnchor_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleTableColumnAnchor>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithLabelFieldNameAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.LabelFieldName!, "FirstName");

        var expectedMarkup = @"label-field-name=""FirstName""";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithHrefFieldNameAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.HrefFieldName!, "Link");

        var expectedMarkup = @"href-field-name=""Link""";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithPlaceholderAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.Placeholder!, "No Value");

        var expectedMarkup = @"placeholder=""No Value""";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithAppearanceAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.Appearance!, AnchorAppearance.Prominent);

        var expectedMarkup = @"appearance=""prominent""";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithUnderlineHiddenAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.UnderlineHidden, true);

        var expectedMarkup = @"underline-hidden";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithHrefLangAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.HrefLang!, "en");

        var expectedMarkup = @"hreflang=""en""";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithPingAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.Ping!, "foo");

        var expectedMarkup = @"ping=""foo""";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithReferrerPolicyAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.ReferrerPolicy!, "foo");

        var expectedMarkup = @"referrerpolicy=""foo""";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithRelAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.Rel!, "foo");

        var expectedMarkup = @"rel=""foo""";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithTargetAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.Target!, "foo");

        var expectedMarkup = @"target=""foo""";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithTypeAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.Type!, "foo");

        var expectedMarkup = @"type=""foo""";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithDownloadAttribute_HasTableMarkup()
    {
        var tableColumn = RenderWithPropertySet(x => x.Download!, "foo");

        var expectedMarkup = @"download=""foo""";
        Assert.Contains(expectedMarkup, tableColumn.Markup);
    }

    private IRenderedComponent<NimbleTableColumnAnchor> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnAnchor, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnAnchor>(p => p.Add(propertyGetter, propertyValue));
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
