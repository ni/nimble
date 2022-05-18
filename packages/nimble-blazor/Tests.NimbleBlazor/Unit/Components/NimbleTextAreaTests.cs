using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTextArea"/>
/// </summary>
public class NimbleTextAreaTests
{
    [Fact]
    public void NimbleTextArea_Rendered_HasTextAreaMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-text-area";

        var textField = context.RenderComponent<NimbleTextArea>();

        Assert.Contains(expectedMarkup, textField.Markup);
    }

    [Theory]
    [InlineData(TextAreaResize.None, "none")]
    [InlineData(TextAreaResize.Both, "both")]
    [InlineData(TextAreaResize.Horizontal, "horizontal")]
    [InlineData(TextAreaResize.Vertical, "vertical")]
    public void TextAreaTextAreaResize_AttributeIsSet(TextAreaResize value, string expectedAttribute)
    {
        var textArea = RenderNimbleTextArea(value);

        Assert.Contains(expectedAttribute, textArea.Markup);
    }

    [Theory]
    [InlineData(TextAreaAppearance.Block, "block")]
    [InlineData(TextAreaAppearance.Outline, "outline")]
    public void TextAreaAppearance_AttributeIsSet(TextAreaAppearance value, string expectedAttribute)
    {
        var textArea = RenderNimbleTextArea(value);

        Assert.Contains(expectedAttribute, textArea.Markup);
    }

    private IRenderedComponent<NimbleTextArea> RenderNimbleTextArea(TextAreaResize textAreaResize)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTextArea>(p => p.Add(x => x.TextAreaResize, textAreaResize));
    }

    private IRenderedComponent<NimbleTextArea> RenderNimbleTextArea(TextAreaAppearance appearance)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTextArea>(p => p.Add(x => x.Appearance, appearance));
    }
}
