using Bunit;
using NimbleBlazor.Components;
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
    [InlineData(Appearance.Block, "block")]
    [InlineData(Appearance.Underline, "underline")]
    [InlineData(Appearance.Ghost, "ghost")]
    public void TextFieldAppearance_AttributeIsSet(Appearance value, string expectedAttribute)
    {
        var button = RenderNimbleButton(value);

        Assert.Contains(expectedAttribute, button.Markup);
    }

    private IRenderedComponent<NimbleButton> RenderNimbleButton(Appearance appearance)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleButton>(p => p.Add(x => x.Appearance, appearance));
    }
}
