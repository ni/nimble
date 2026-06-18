using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleBanner"/>.
/// </summary>
public class NimbleBannerTests : BunitTestBase
{
    [Fact]
    public void NimbleBanner_Render_HasBannerMarkup()
    {
        var banner = Render<NimbleBanner>();

        Assert.NotNull(banner.Find("nimble-banner"));
    }

    [Fact]
    public void NimbleBanner_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleBanner>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(BannerSeverity.Default, null)]
    [InlineData(BannerSeverity.Error, "error")]
    [InlineData(BannerSeverity.Warning, "warning")]
    [InlineData(BannerSeverity.Information, "information")]
    public void BannerSeverity_AttributeIsSet(BannerSeverity value, string? expectedAttribute)
    {
        var banner = RenderWithPropertySet(x => x.Severity, value);

        banner.AssertAttribute("severity", expectedAttribute);
    }

    private IRenderedComponent<NimbleBanner> RenderWithPropertySet<TProperty>(Expression<Func<NimbleBanner, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleBanner>(p => p.Add(propertyGetter, propertyValue));
    }
}
