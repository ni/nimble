using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTextArea"/>
/// </summary>
public class NimbleTextAreaTests : BunitTestBase
{
    [Fact]
    public void NimbleTextArea_Rendered_HasTextAreaMarkup()
    {
        var textField = Render<NimbleTextArea>();

        Assert.NotNull(textField.Find("nimble-text-area"));
    }

    [Fact]
    public void NimbleTextArea_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleTextArea>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(TextAreaResize.None, "none")]
    [InlineData(TextAreaResize.Both, "both")]
    [InlineData(TextAreaResize.Horizontal, "horizontal")]
    [InlineData(TextAreaResize.Vertical, "vertical")]
    public void TextAreaTextAreaResize_AttributeIsSet(TextAreaResize value, string expectedAttribute)
    {
        var textArea = RenderNimbleTextArea(value);

        textArea.AssertAttribute("resize", expectedAttribute);
    }

    [Theory]
    [InlineData(TextAreaAppearance.Block, "block")]
    [InlineData(TextAreaAppearance.Outline, "outline")]
    public void TextAreaAppearance_AttributeIsSet(TextAreaAppearance value, string expectedAttribute)
    {
        var textArea = RenderNimbleTextArea(value);

        textArea.AssertAttribute("appearance", expectedAttribute);
    }

    [Fact]
    public void TextAreaErrorText_AttributeIsSet()
    {
        var textArea = RenderWithPropertySet(x => x.ErrorText, "bad value");

        textArea.AssertAttribute("error-text", "bad value");
    }

    [Fact]
    public void TextAreaErrorVisible_AttributeIsSet()
    {
        var textArea = RenderWithPropertySet(x => x.ErrorVisible, true);

        textArea.AssertHasAttribute("error-visible");
    }

    [Fact]
    public void TextAreaRequiredVisible_AttributeIsSet()
    {
        var textArea = RenderWithPropertySet(x => x.RequiredVisible, true);

        textArea.AssertHasAttribute("required-visible");
    }

    [Fact]
    public void TextAreaAppearanceReadOnly_AttributeIsSet()
    {
        var textArea = RenderWithPropertySet(x => x.AppearanceReadOnly, true);

        textArea.AssertHasAttribute("appearance-readonly");
    }

    private IRenderedComponent<NimbleTextArea> RenderNimbleTextArea(TextAreaResize textAreaResize)
    {
        return Render<NimbleTextArea>(p => p.Add(x => x.TextAreaResize, textAreaResize));
    }

    private IRenderedComponent<NimbleTextArea> RenderNimbleTextArea(TextAreaAppearance appearance)
    {
        return Render<NimbleTextArea>(p => p.Add(x => x.Appearance, appearance));
    }

    private IRenderedComponent<NimbleTextArea> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTextArea, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleTextArea>(p => p.Add(propertyGetter, propertyValue));
    }
}
