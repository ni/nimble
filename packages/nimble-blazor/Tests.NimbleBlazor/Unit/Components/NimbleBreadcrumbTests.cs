using Bunit;
using NimbleBlazor;
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
}
