using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleBanner"/>.
/// </summary>
public class NimbleBannerTests
{
    [Fact]
    public void NimbleBanner_Render_HasBannerMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-banner";

        var banner = context.RenderComponent<NimbleBanner>();

        Assert.Contains(expectedMarkup, banner.Markup);
    }

    [Fact]
    public void NimbleBanner_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleBanner>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(BannerSeverity.Default, "<nimble-banner((?!severity).)*>")]
    [InlineData(BannerSeverity.Error, "severity=\"error\"")]
    [InlineData(BannerSeverity.Warning, "severity=\"warning\"")]
    [InlineData(BannerSeverity.Information, "severity=\"information\"")]
    public void BannerSeverity_AttributeIsSet(BannerSeverity value, string expectedMarkupRegEx)
    {
        var banner = RenderWithPropertySet(x => x.Severity, value);

        Assert.Matches(expectedMarkupRegEx, banner.Markup);
    }

    private IRenderedComponent<NimbleBanner> RenderWithPropertySet<TProperty>(Expression<Func<NimbleBanner, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleBanner>(p => p.Add(propertyGetter, propertyValue));
    }
}
