using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

#nullable enable

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleMenuButton"/>
/// </summary>
public class NimbleMenuButtonTests : BunitTestBase
{
    [Fact]
    public void NimbleMenuButton_Rendered_HasButtonMarkup()
    {
        var button = Render<NimbleMenuButton>();

        Assert.NotNull(button.Find("nimble-menu-button"));
    }

    [Fact]
    public void NimbleMenuButton_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleMenuButton>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(ButtonAppearance.Block, "block")]
    [InlineData(ButtonAppearance.Outline, "outline")]
    [InlineData(ButtonAppearance.Ghost, "ghost")]
    public void ButtonAppearance_AttributeIsSet(ButtonAppearance value, string expectedAttribute)
    {
        var button = RenderNimbleMenuButton(value);

        button.AssertAttribute("appearance", expectedAttribute);
    }

    [Theory]
    [InlineData(ButtonAppearanceVariant.Default, null)]
    [InlineData(ButtonAppearanceVariant.Primary, "primary")]
    [InlineData(ButtonAppearanceVariant.Accent, "accent")]
    public void ButtonAppearanceVariant_AttributeIsSet(ButtonAppearanceVariant value, string? expectedAttribute)
    {
        var button = RenderNimbleMenuButton(value);

        button.AssertAttribute("appearance-variant", expectedAttribute);
    }

    [Theory]
    [InlineData(MenuButtonPosition.Above, "above")]
    [InlineData(MenuButtonPosition.Below, "below")]
    [InlineData(MenuButtonPosition.Auto, "auto")]
    public void ButtonPosition_AttributeIsSet(MenuButtonPosition value, string expectedAttribute)
    {
        var button = RenderNimbleMenuButton(value);

        button.AssertAttribute("position", expectedAttribute);
    }

    private IRenderedComponent<NimbleMenuButton> RenderNimbleMenuButton(ButtonAppearance appearance)
    {
        return Render<NimbleMenuButton>(p => p.Add(x => x.Appearance, appearance));
    }

    private IRenderedComponent<NimbleMenuButton> RenderNimbleMenuButton(ButtonAppearanceVariant appearanceVariant)
    {
        return Render<NimbleMenuButton>(p => p.Add(x => x.AppearanceVariant, appearanceVariant));
    }

    private IRenderedComponent<NimbleMenuButton> RenderNimbleMenuButton(MenuButtonPosition position)
    {
        return Render<NimbleMenuButton>(p => p.Add(x => x.Position, position));
    }
}
