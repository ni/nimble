using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

#nullable enable

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleToggleButton"/>
/// </summary>
public class NimbleToggleButtonTests : BunitTestBase
{
    [Fact]
    public void NimbleToggleButton_Rendered_HasButtonMarkup()
    {
        var button = Render<NimbleToggleButton>();

        Assert.NotNull(button.Find("nimble-toggle-button"));
    }

    [Fact]
    public void NimbleToggleButton_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleToggleButton>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(ButtonAppearance.Block, "block")]
    [InlineData(ButtonAppearance.Outline, "outline")]
    [InlineData(ButtonAppearance.Ghost, "ghost")]
    public void ButtonAppearance_AttributeIsSet(ButtonAppearance value, string expectedAttribute)
    {
        var button = RenderNimbleToggleButton(value);

        button.AssertAttribute("appearance", expectedAttribute);
    }

    [Theory]
    [InlineData(ButtonAppearanceVariant.Default, null)]
    [InlineData(ButtonAppearanceVariant.Primary, "primary")]
    [InlineData(ButtonAppearanceVariant.Accent, "accent")]
    public void ButtonAppearanceVariant_AttributeIsSet(ButtonAppearanceVariant value, string? expectedValue)
    {
        var button = RenderNimbleToggleButton(value);

        button.AssertAttribute("appearance-variant", expectedValue);
    }

    private IRenderedComponent<NimbleToggleButton> RenderNimbleToggleButton(ButtonAppearance appearance)
    {
        return Render<NimbleToggleButton>(p => p.Add(x => x.Appearance, appearance));
    }

    private IRenderedComponent<NimbleToggleButton> RenderNimbleToggleButton(ButtonAppearanceVariant appearanceVariant)
    {
        return Render<NimbleToggleButton>(p => p.Add(x => x.AppearanceVariant, appearanceVariant));
    }
}
