using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleNumberField"/>
/// </summary>
public class NimbleNumberFieldTests : BunitTestBase
{
    private const string NumberFieldMarkup = "nimble-number-field";

    [Fact]
    public void NimbleNumberField_Rendered_HasNumberFieldMarkup()
    {
        var textField = Render<NimbleNumberField>();

        Assert.NotNull(textField.Find(NumberFieldMarkup));
    }

    [Theory]
    [InlineData("42.42")]
    [InlineData("1E+20")]
    [InlineData("1E+50")]
    [InlineData("1E+100")]
    public void Render_ChangeValue_HasMatchingValue(string value)
    {
        var field = Render<NimbleNumberField>();

        field.Find(NumberFieldMarkup).Change(value);

        Assert.NotNull(field.Instance.Value);
        Assert.Equal(value, field.Instance.Value.ToString());
    }

    [Fact]
    public void NimbleNumberField_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleNumberField>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(NumberFieldAppearance.Outline, "outline")]
    [InlineData(NumberFieldAppearance.Block, "block")]
    [InlineData(NumberFieldAppearance.Underline, "underline")]
    [InlineData(NumberFieldAppearance.Frameless, "frameless")]
    public void NumberFieldAppearance_AttributeIsSet(NumberFieldAppearance value, string expectedAttribute)
    {
        var numberField = RenderWithPropertySet(x => x.Appearance, value);

        numberField.AssertAttribute("appearance", expectedAttribute);
    }

    [Fact]
    public void NumberFieldStep_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.Step, 2.3);

        numberField.AssertAttribute("step", "2.3");
    }

    [Fact]
    public void NumberFieldHideStep_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.HideStep, true);

        numberField.AssertHasAttribute("hide-step");
    }

    [Fact]
    public void NumberFieldMin_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.Min, 2.3);

        numberField.AssertAttribute("min", "2.3");
    }

    [Fact]
    public void NumberFieldMax_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.Max, 2.3);

        numberField.AssertAttribute("max", "2.3");
    }

    [Fact]
    public void NumberFieldPlaceholder_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.Placeholder, "enter a value");

        numberField.AssertAttribute("placeholder", "enter a value");
    }

    [Fact]
    public void NumberFieldErrorText_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.ErrorText, "bad number");

        numberField.AssertAttribute("error-text", "bad number");
    }

    [Fact]
    public void NumberFieldErrorVisible_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.ErrorVisible, true);

        numberField.AssertHasAttribute("error-visible");
    }

    [Fact]
    public void NumberFieldDisabled_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.Disabled, true);

        numberField.AssertHasAttribute("disabled");
    }

    [Fact]
    public void NumberFieldReadOnly_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.ReadOnly, true);

        numberField.AssertHasAttribute("readonly");
    }

    [Fact]
    public void NumberFieldRequiredVisible_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.RequiredVisible, true);

        numberField.AssertHasAttribute("required-visible");
    }

    [Fact]
    public void NumberFieldAppearanceReadOnly_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.AppearanceReadOnly, true);

        numberField.AssertHasAttribute("appearance-readonly");
    }

    [Fact]
    public void NumberFieldFullBleed_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.FullBleed, true);

        numberField.AssertHasAttribute("full-bleed");
    }

    [Fact]
    public void NumberFieldValue_WithGermanCulture_FormatsValueWithPeriod()
    {
        using (new CultureScope("de-DE"))
        {
            var numberField = RenderWithPropertySet(x => x.Value, 1.5);

            numberField.AssertAttribute("current-value", "1.5");
        }
    }

    [Fact]
    public void NumberFieldStep_WithGermanCulture_FormatsValueWithPeriod()
    {
        using (new CultureScope("de-DE"))
        {
            var numberField = RenderWithPropertySet(x => x.Step, 1.5);

            numberField.AssertAttribute("step", "1.5");
        }
    }

    [Fact]
    public void NumberFieldMin_WithGermanCulture_FormatsValueWithPeriod()
    {
        using (new CultureScope("de-DE"))
        {
            var numberField = RenderWithPropertySet(x => x.Min, 1.5);

            numberField.AssertAttribute("min", "1.5");
        }
    }

    [Fact]
    public void NumberFieldMax_WithGermanCulture_FormatsValueWithPeriod()
    {
        using (new CultureScope("de-DE"))
        {
            var numberField = RenderWithPropertySet(x => x.Max, 1.5);

            numberField.AssertAttribute("max", "1.5");
        }
    }

    private IRenderedComponent<NimbleNumberField> RenderWithPropertySet<TProperty>(Expression<Func<NimbleNumberField, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleNumberField>(p => p.Add(propertyGetter, propertyValue));
    }
}
