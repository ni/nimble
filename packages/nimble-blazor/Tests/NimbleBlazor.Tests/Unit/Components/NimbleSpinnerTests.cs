using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleSpinner"/>.
/// </summary>
public class NimbleSpinnerTests
{
    [Fact]
    public void NimbleSpinner_Render_HasSpinnerMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-spinner";

        var spinner = context.RenderComponent<NimbleSpinner>();

        Assert.Contains(expectedMarkup, spinner.Markup);
    }

    [Fact]
    public void NimbleSpinner_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleSpinner>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(SpinnerAppearance.Default, "<nimble-spinner((?!appearance).)*>")]
    [InlineData(SpinnerAppearance.Accent, "appearance=\"accent\"")]
    public void SpinnerAppearance_AttributeIsSet(SpinnerAppearance value, string expectedMarkupRegEx)
    {
        var spinner = RenderWithPropertySet(x => x.Appearance, value);

        Assert.Matches(expectedMarkupRegEx, spinner.Markup);
    }

    private IRenderedComponent<NimbleSpinner> RenderWithPropertySet<TProperty>(Expression<Func<NimbleSpinner, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleSpinner>(p => p.Add(propertyGetter, propertyValue));
    }
}