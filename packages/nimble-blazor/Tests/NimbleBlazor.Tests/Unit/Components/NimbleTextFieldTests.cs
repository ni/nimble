using System;
using System.Linq.Expressions;
using Bunit;
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
        var textField = RenderWithPropertySet(x => x.TextFieldType, value);

        Assert.Contains(expectedAttribute, textField.Markup);
    }

    [Theory]
    [InlineData(TextFieldAppearance.Outline, "outline")]
    [InlineData(TextFieldAppearance.Block, "block")]
    [InlineData(TextFieldAppearance.Underline, "underline")]
    [InlineData(TextFieldAppearance.Frameless, "frameless")]
    public void TextFieldAppearance_AttributeIsSet(TextFieldAppearance value, string expectedAttribute)
    {
        var textField = RenderWithPropertySet(x => x.Appearance, value);

        Assert.Contains(expectedAttribute, textField.Markup);
    }

    [Fact]
    public void ComboboxErrorText_AttributeIsSet()
    {
        var textField = RenderWithPropertySet(x => x.ErrorText, "bad number");

        Assert.Contains("error-text=\"bad number\"", textField.Markup);
    }

    [Fact]
    public void ComboboxErrorVisible_AttributeIsSet()
    {
        var textField = RenderWithPropertySet(x => x.ErrorVisible, true);

        Assert.Contains("error-visible", textField.Markup);
    }

    [Fact]
    public void ComboboxFullBleed_AttributeIsSet()
    {
        var textField = RenderWithPropertySet(x => x.FullBleed, true);

        Assert.Contains("full-bleed", textField.Markup);
    }

    private IRenderedComponent<NimbleTextField> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTextField, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTextField>(p => p.Add(propertyGetter, propertyValue));
    }
}
