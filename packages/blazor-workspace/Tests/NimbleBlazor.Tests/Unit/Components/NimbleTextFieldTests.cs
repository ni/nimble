using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTextField"/>
/// </summary>
public class NimbleTextFieldTests : BunitTestBase
{
    [Fact]
    public void NimbleTextField_Rendered_HasTextFieldMarkup()
    {
        var textField = Render<NimbleTextField>();
        Assert.NotNull(textField.Find("nimble-text-field"));
    }

    [Fact]
    public void NimbleTextField_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleTextField>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
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

        textField.AssertAttribute("type", expectedAttribute);
    }

    [Theory]
    [InlineData(TextFieldAppearance.Outline, "outline")]
    [InlineData(TextFieldAppearance.Block, "block")]
    [InlineData(TextFieldAppearance.Underline, "underline")]
    [InlineData(TextFieldAppearance.Frameless, "frameless")]
    public void TextFieldAppearance_AttributeIsSet(TextFieldAppearance value, string expectedAttribute)
    {
        var textField = RenderWithPropertySet(x => x.Appearance, value);

        textField.AssertAttribute("appearance", expectedAttribute);
    }

    [Fact]
    public void TextFieldErrorText_AttributeIsSet()
    {
        var textField = RenderWithPropertySet(x => x.ErrorText, "bad number");

        textField.AssertAttribute("error-text", "bad number");
    }

    [Fact]
    public void TextFieldErrorVisible_AttributeIsSet()
    {
        var textField = RenderWithPropertySet(x => x.ErrorVisible, true);

        textField.AssertHasAttribute("error-visible");
    }

    [Fact]
    public void TextFieldFullBleed_AttributeIsSet()
    {
        var textField = RenderWithPropertySet(x => x.FullBleed, true);

        textField.AssertHasAttribute("full-bleed");
    }

    [Fact]
    public void TextFieldRequiredVisible_AttributeIsSet()
    {
        var textField = RenderWithPropertySet(x => x.RequiredVisible, true);

        textField.AssertHasAttribute("required-visible");
    }

    [Fact]
    public void TextFieldAppearanceReadOnly_AttributeIsSet()
    {
        var textField = RenderWithPropertySet(x => x.AppearanceReadOnly, true);

        textField.AssertHasAttribute("appearance-readonly");
    }

    private IRenderedComponent<NimbleTextField> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTextField, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleTextField>(p => p.Add(propertyGetter, propertyValue));
    }
}
