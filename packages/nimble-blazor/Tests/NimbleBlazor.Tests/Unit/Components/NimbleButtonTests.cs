using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleButton"/>.
/// </summary>
public class NimbleButtonTests
{
    [Fact]
    public void NimbleButton_Render_HasButtonMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-button";

        var button = context.RenderComponent<NimbleButton>();

        Assert.Contains(expectedMarkup, button.Markup);
    }

    [Theory]
    [InlineData(ButtonAppearance.Block, "block")]
    [InlineData(ButtonAppearance.Outline, "outline")]
    [InlineData(ButtonAppearance.Ghost, "ghost")]
    public void ButtonAppearance_AttributeIsSet(ButtonAppearance value, string expectedAttribute)
    {
        var button = RenderWithPropertySet(x => x.Appearance, value);

        Assert.Contains(expectedAttribute, button.Markup);
    }

    [Theory]
    [InlineData(ButtonAppearanceVariant.Default, "<nimble-button>")]
    [InlineData(ButtonAppearanceVariant.Primary, "appearance-variant=\"primary\"")]
    public void ButtonAppearanceVariant_AttributeIsSet(ButtonAppearanceVariant value, string expectedAttribute)
    {
        var button = RenderWithPropertySet(x => x.AppearanceVariant, value);

        Assert.Contains(expectedAttribute, button.Markup);
    }

    private IRenderedComponent<NimbleButton> RenderWithPropertySet<TProperty>(Expression<Func<NimbleButton, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleButton>(p => p.Add(propertyGetter, propertyValue));
    }
}
