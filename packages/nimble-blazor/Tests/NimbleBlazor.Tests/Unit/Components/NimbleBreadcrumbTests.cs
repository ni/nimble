using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleBreadcrumb"/>
/// </summary>
public class NimbleBreadcrumbTests
{
    [Fact]
    public void NimbleBreadcrumb_Rendered_HasBreadcrumbMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-breadcrumb";

        var breadcrumb = context.RenderComponent<NimbleBreadcrumb>();

        Assert.Contains(expectedMarkup, breadcrumb.Markup);
    }

    [Fact]
    public void NimbleBreadcrumbItem_Rendered_HasBreadcrumbItemMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-breadcrumb-item";

        var breadcrumbItem = context.RenderComponent<NimbleBreadcrumbItem>();

        Assert.Contains(expectedMarkup, breadcrumbItem.Markup);
    }

    [Theory]
    [InlineData(BreadcrumbAppearance.Default, "<nimble-breadcrumb>")]
    [InlineData(BreadcrumbAppearance.Prominent, "appearance=\"prominent\"")]
    public void BreadcrumbAppearance_AttributeIsSet(BreadcrumbAppearance value, string expectedAttribute)
    {
        var breadcrumb = RenderWithPropertySet(x => x.Appearance, value);

        Assert.Contains(expectedAttribute, breadcrumb.Markup);
    }

    private IRenderedComponent<NimbleBreadcrumb> RenderWithPropertySet<TProperty>(Expression<Func<NimbleBreadcrumb, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleBreadcrumb>(p => p.Add(propertyGetter, propertyValue));
    }
}
