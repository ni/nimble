using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleToggleButton"/>
/// </summary>
public class NimbleToggleButtonTests
{
    [Fact]
    public void NimbleToggleButton_Rendered_HasButtonMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-toggle-button";

        var button = context.RenderComponent<NimbleToggleButton>();

        Assert.Contains(expectedMarkup, button.Markup);
    }

    [Fact]
    public void NimbleToggleButton_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleToggleButton>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(ButtonAppearance.Block, "block")]
    [InlineData(ButtonAppearance.Outline, "outline")]
    [InlineData(ButtonAppearance.Ghost, "ghost")]
    public void ButtonAppearance_AttributeIsSet(ButtonAppearance value, string expectedAttribute)
    {
        var button = RenderNimbleToggleButton(value);

        Assert.Contains(expectedAttribute, button.Markup);
    }

    [Theory]
    [InlineData(ButtonAppearanceVariant.Default, "<nimble-toggle-button>")]
    [InlineData(ButtonAppearanceVariant.Primary, "appearance-variant=\"primary\"")]
    [InlineData(ButtonAppearanceVariant.Accent, "appearance-variant=\"accent\"")]
    public void ButtonAppearanceVariant_AttributeIsSet(ButtonAppearanceVariant value, string expectedAttribute)
    {
        var button = RenderNimbleToggleButton(value);

        Assert.Contains(expectedAttribute, button.Markup);
    }

    private IRenderedComponent<NimbleToggleButton> RenderNimbleToggleButton(ButtonAppearance appearance)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleToggleButton>(p => p.Add(x => x.Appearance, appearance));
    }

    private IRenderedComponent<NimbleToggleButton> RenderNimbleToggleButton(ButtonAppearanceVariant appearanceVariant)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleToggleButton>(p => p.Add(x => x.AppearanceVariant, appearanceVariant));
    }
}
