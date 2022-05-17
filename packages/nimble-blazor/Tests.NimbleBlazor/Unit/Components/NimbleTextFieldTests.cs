using Bunit;
using NimbleBlazor;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTextField"/>
/// </summary>
public class NimbleTextFieldTests
{
    [Fact]
    public void NimbleTextField_Rendered_HasTextFieldMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-text-field";

        var textField = context.RenderComponent<NimbleTextField>();

        Assert.Contains(expectedMarkup, textField.Markup);
    }

    [Theory]
    [InlineData(TextFieldType.Tel, "tel")]
    [InlineData(TextFieldType.Password, "password")]
    [InlineData(TextFieldType.Email, "email")]
    [InlineData(TextFieldType.Url, "url")]
    [InlineData(TextFieldType.Text, "text")]
    public void TextFieldTextFieldType_AttributeIsSet(TextFieldType value, string expectedAttribute)
    {
        var textField = RenderNimbleTextField(value);

        Assert.Contains(expectedAttribute, textField.Markup);
    }

    [Theory]
    [InlineData(TextFieldAppearance.Outline, "outline")]
    [InlineData(TextFieldAppearance.Block, "block")]
    [InlineData(TextFieldAppearance.Underline, "underline")]
    [InlineData(TextFieldAppearance.Frameless, "frameless")]
    public void TextFieldAppearance_AttributeIsSet(TextFieldAppearance value, string expectedAttribute)
    {
        var textField = RenderNimbleTextField(value);

        Assert.Contains(expectedAttribute, textField.Markup);
    }

    private IRenderedComponent<NimbleTextField> RenderNimbleTextField(TextFieldType textFieldType)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTextField>(p => p.Add(x => x.TextFieldType, textFieldType));
    }

    private IRenderedComponent<NimbleTextField> RenderNimbleTextField(TextFieldAppearance appearance)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTextField>(p => p.Add(x => x.Appearance, appearance));
    }
}
