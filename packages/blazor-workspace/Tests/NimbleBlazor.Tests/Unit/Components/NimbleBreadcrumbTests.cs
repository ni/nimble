using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

#nullable enable

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleBreadcrumb"/>
/// </summary>
public class NimbleBreadcrumbTests : BunitTestBase
{
    [Fact]
    public void NimbleBreadcrumb_Rendered_HasBreadcrumbMarkup()
    {
        var breadcrumb = Render<NimbleBreadcrumb>();

        Assert.NotNull(breadcrumb.Find("nimble-breadcrumb"));
    }

    [Fact]
    public void NimbleBreadcrumb_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleBreadcrumb>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleBreadcrumbItem_Rendered_HasBreadcrumbItemMarkup()
    {
        var breadcrumbItem = Render<NimbleBreadcrumbItem>();

        Assert.NotNull(breadcrumbItem.Find("nimble-breadcrumb-item"));
    }

    [Theory]
    [InlineData(BreadcrumbAppearance.Default, null)]
    [InlineData(BreadcrumbAppearance.Prominent, "prominent")]
    public void BreadcrumbAppearance_AttributeIsSet(BreadcrumbAppearance value, string? expectedAttribute)
    {
        var breadcrumb = RenderWithPropertySet(x => x.Appearance, value);

        breadcrumb.AssertAttribute("appearance", expectedAttribute);
    }

    private IRenderedComponent<NimbleBreadcrumb> RenderWithPropertySet<TProperty>(Expression<Func<NimbleBreadcrumb, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleBreadcrumb>(p => p.Add(propertyGetter, propertyValue));
    }
}
