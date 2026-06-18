using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleSpinner"/>.
/// </summary>
public class NimbleSpinnerTests : BunitTestBase
{
    [Fact]
    public void NimbleSpinner_Render_HasSpinnerMarkup()
    {
        var spinner = Render<NimbleSpinner>();

        Assert.NotNull(spinner.Find("nimble-spinner"));
    }

    [Fact]
    public void NimbleSpinner_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleSpinner>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(SpinnerAppearance.Default, null)]
    [InlineData(SpinnerAppearance.Accent, "accent")]
    public void SpinnerAppearance_AttributeIsSet(SpinnerAppearance value, string? expectedValue)
    {
        var spinner = RenderWithPropertySet(x => x.Appearance, value);

        spinner.AssertAttribute("appearance", expectedValue);
    }

    private IRenderedComponent<NimbleSpinner> RenderWithPropertySet<TProperty>(Expression<Func<NimbleSpinner, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleSpinner>(p => p.Add(propertyGetter, propertyValue));
    }
}