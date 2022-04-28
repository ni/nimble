using Bunit;
using NimbleBlazor.Components;
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

    [Theory]
    [InlineData(Appearance.Block, "block")]
    [InlineData(Appearance.Underline, "underline")]
    [InlineData(Appearance.Ghost, "ghost")]
    public void ButtonAppearance_AttributeIsSet(Appearance value, string expectedAttribute)
    {
        var button = RenderNimbleToggleButton(value);

        Assert.Contains(expectedAttribute, button.Markup);
    }

    private IRenderedComponent<NimbleToggleButton> RenderNimbleToggleButton(Appearance appearance)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleToggleButton>(p => p.Add(x => x.Appearance, appearance));
    }
}
