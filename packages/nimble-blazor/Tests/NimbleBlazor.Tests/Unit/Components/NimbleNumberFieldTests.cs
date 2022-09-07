using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTextField"/>
/// </summary>
public class NimbleNumberFieldTests
{
    [Fact]
    public void NimbleNumberField_Rendered_HasNumberFieldMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-number-field";

        var textField = context.RenderComponent<NimbleNumberField>();

        Assert.Contains(expectedMarkup, textField.Markup);
    }

    [Theory]
    [InlineData(NumberFieldAppearance.Outline, "outline")]
    [InlineData(NumberFieldAppearance.Block, "block")]
    [InlineData(NumberFieldAppearance.Underline, "underline")]
    public void TextFieldAppearance_AttributeIsSet(NumberFieldAppearance value, string expectedAttribute)
    {
        var textField = RenderNimbleTextField(value);

        Assert.Contains(expectedAttribute, textField.Markup);
    }

    private IRenderedComponent<NimbleNumberField> RenderNimbleTextField(NumberFieldAppearance appearance)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleNumberField>(p => p.Add(x => x.Appearance, appearance));
    }
}
