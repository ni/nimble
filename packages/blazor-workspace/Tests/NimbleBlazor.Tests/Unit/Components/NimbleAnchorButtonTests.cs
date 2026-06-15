using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

#nullable enable

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchorButton"/>.
/// </summary>
public class NimbleAnchorButtonTests : NimbleAnchorBaseTests<NimbleAnchorButton>
{
    [Fact]
    public void NimbleAnchorButton_Render_HasAnchorButtonMarkup()
    {
        var button = Render<NimbleAnchorButton>();

        Assert.NotNull(button.Find("nimble-anchor-button"));
    }

    [Fact]
    public void NimbleAnchorButton_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleAnchorButton>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(ButtonAppearance.Block, "block")]
    [InlineData(ButtonAppearance.Outline, "outline")]
    [InlineData(ButtonAppearance.Ghost, "ghost")]
    public void ButtonAppearance_AttributeIsSet(ButtonAppearance value, string expectedAttribute)
    {
        var button = RenderWithPropertySet(x => x.Appearance, value);

        button.AssertAttribute("appearance", expectedAttribute);
    }

    [Theory]
    [InlineData(ButtonAppearanceVariant.Default, null)]
    [InlineData(ButtonAppearanceVariant.Primary, "primary")]
    public void ButtonAppearanceVariant_AttributeIsSet(ButtonAppearanceVariant value, string? expectedValue)
    {
        var button = RenderWithPropertySet(x => x.AppearanceVariant, value);

        button.AssertAttribute("appearance-variant", expectedValue);
    }

    private IRenderedComponent<NimbleAnchorButton> RenderWithPropertySet<TProperty>(Expression<Func<NimbleAnchorButton, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleAnchorButton>(p => p.Add(propertyGetter, propertyValue));
    }
}
