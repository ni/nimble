using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleButton"/>.
/// </summary>
public class NimbleButtonTests : BunitTestBase
{
    [Fact]
    public void NimbleButton_Render_HasButtonMarkup()
    {
        var button = Render<NimbleButton>();

        Assert.NotNull(button.Find("nimble-button"));
    }

    [Fact]
    public void NimbleButton_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleButton>(parameters => parameters.AddUnmatched("class", "foo")));
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
    [InlineData(ButtonAppearanceVariant.Accent, "accent")]
    public void ButtonAppearanceVariant_AttributeIsSet(ButtonAppearanceVariant value, string? expectedAttribute)
    {
        var button = RenderWithPropertySet(x => x.AppearanceVariant, value);

        button.AssertAttribute("appearance-variant", expectedAttribute);
    }

    private IRenderedComponent<NimbleButton> RenderWithPropertySet<TProperty>(Expression<Func<NimbleButton, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleButton>(p => p.Add(propertyGetter, propertyValue));
    }
}
