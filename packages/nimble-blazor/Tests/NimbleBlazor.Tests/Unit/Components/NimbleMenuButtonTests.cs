using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleMenuButton"/>
/// </summary>
public class NimbleMenuButtonTests
{
    [Fact]
    public void NimbleMenuButton_Rendered_HasButtonMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-menu-button";

        var button = context.RenderComponent<NimbleMenuButton>();

        Assert.Contains(expectedMarkup, button.Markup);
    }

    [Fact]
    public void NimbleMenuButton_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleMenuButton>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(ButtonAppearance.Block, "block")]
    [InlineData(ButtonAppearance.Outline, "outline")]
    [InlineData(ButtonAppearance.Ghost, "ghost")]
    public void ButtonAppearance_AttributeIsSet(ButtonAppearance value, string expectedAttribute)
    {
        var button = RenderNimbleMenuButton(value);

        Assert.Contains(expectedAttribute, button.Markup);
    }

    [Theory]
    [InlineData(MenuButtonPosition.Above, "above")]
    [InlineData(MenuButtonPosition.Below, "below")]
    [InlineData(MenuButtonPosition.Auto, "auto")]
    public void ButtonPosition_AttributeIsSet(MenuButtonPosition value, string expectedAttribute)
    {
        var button = RenderNimbleMenuButton(value);

        Assert.Contains(expectedAttribute, button.Markup);
    }

    private IRenderedComponent<NimbleMenuButton> RenderNimbleMenuButton(ButtonAppearance appearance)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleMenuButton>(p => p.Add(x => x.Appearance, appearance));
    }

    private IRenderedComponent<NimbleMenuButton> RenderNimbleMenuButton(MenuButtonPosition position)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleMenuButton>(p => p.Add(x => x.Position, position));
    }
}
