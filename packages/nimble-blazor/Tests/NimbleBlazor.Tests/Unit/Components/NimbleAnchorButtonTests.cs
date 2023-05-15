using System;
using System.Linq.Expressions;
using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchorButton"/>.
/// </summary>
public class NimbleAnchorButtonTests : NimbleAnchorBaseTests<NimbleAnchorButton>
{
    [Fact]
    public void NimbleAnchorButton_Render_HasAnchorButtonMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-anchor-button";

        var button = context.RenderComponent<NimbleAnchorButton>();

        Assert.Contains(expectedMarkup, button.Markup);
    }

    [Fact]
    public void NimbleAnchorButton_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleAnchorButton>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
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
    [InlineData(ButtonAppearanceVariant.Default, "<nimble-anchor-button>")]
    [InlineData(ButtonAppearanceVariant.Primary, "appearance-variant=\"primary\"")]
    public void ButtonAppearanceVariant_AttributeIsSet(ButtonAppearanceVariant value, string expectedMarkup)
    {
        var button = RenderWithPropertySet(x => x.AppearanceVariant, value);

        Assert.Contains(expectedMarkup, button.Markup);
    }

    private IRenderedComponent<NimbleAnchorButton> RenderWithPropertySet<TProperty>(Expression<Func<NimbleAnchorButton, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleAnchorButton>(p => p.Add(propertyGetter, propertyValue));
    }
}
