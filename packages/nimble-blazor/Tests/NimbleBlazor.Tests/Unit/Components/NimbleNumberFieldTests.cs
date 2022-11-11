using System;
using System.Linq.Expressions;
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
    public void NumberFieldAppearance_AttributeIsSet(NumberFieldAppearance value, string expectedAttribute)
    {
        var numberField = RenderWithPropertySet(x => x.Appearance, value);

        Assert.Contains(expectedAttribute, numberField.Markup);
    }

    [Fact]
    public void NumberFieldStep_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.Step, 2.3);

        Assert.Contains("step=\"2.3\"", numberField.Markup);
    }

    [Fact]
    public void NumberFieldMin_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.Min, 2.3);

        Assert.Contains("min=\"2.3\"", numberField.Markup);
    }

    [Fact]
    public void NumberFieldMax_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.Max, 2.3);

        Assert.Contains("max=\"2.3\"", numberField.Markup);
    }

    [Fact]
    public void NumberFieldPlaceholder_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.Placeholder, "enter a value");

        Assert.Contains("placeholder=\"enter a value\"", numberField.Markup);
    }

    [Fact]
    public void NumberFieldErrorText_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.ErrorText, "bad number");

        Assert.Contains("error-text=\"bad number\"", numberField.Markup);
    }

    [Fact]
    public void NumberFieldErrorVisible_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.ErrorVisible, true);

        Assert.Contains("error-visible", numberField.Markup);
    }

    [Fact]
    public void NumberFieldDisabled_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.Disabled, true);

        Assert.Contains("disabled", numberField.Markup);
    }

    [Fact]
    public void NumberFieldReadOnly_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.ReadOnly, true);

        Assert.Contains("readonly", numberField.Markup);
    }

    private IRenderedComponent<NimbleNumberField> RenderWithPropertySet<TProperty>(Expression<Func<NimbleNumberField, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleNumberField>(p => p.Add(propertyGetter, propertyValue));
    }
}
