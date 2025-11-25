using System;
using System.Globalization;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTextField"/>
/// </summary>
public class NimbleNumberFieldTests
{
    private const string NumberFieldMarkup = "nimble-number-field";

    [Fact]
    public void NimbleNumberField_Rendered_HasNumberFieldMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;

        var textField = context.RenderComponent<NimbleNumberField>();

        Assert.Contains(NumberFieldMarkup, textField.Markup);
    }

    [Theory]
    [InlineData("42.42")]
    [InlineData("1E+20")]
    [InlineData("1E+50")]
    [InlineData("1E+100")]
    public void Render_ChangeValue_HasMatchingValue(string value)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var field = context.RenderComponent<NimbleNumberField>();

        field.Find(NumberFieldMarkup).Change(value);

        Assert.NotNull(field.Instance.Value);
        Assert.Equal(value, field.Instance.Value.ToString());
    }

    [Fact]
    public void NimbleNumberField_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleNumberField>(ComponentParameter.CreateParameter("class", "foo")));
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

        Assert.Contains(expectedAttribute, numberField.Markup);
    }

    [Fact]
    public void NumberFieldStep_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.Step, 2.3);

        Assert.Contains("step=\"2.3\"", numberField.Markup);
    }

    [Fact]
    public void NumberFieldHideStep_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.HideStep, true);

        Assert.Contains("hide-step", numberField.Markup);
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

    [Fact]
    public void NumberFieldRequiredVisible_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.RequiredVisible, true);

        Assert.Contains("required-visible", numberField.Markup);
    }

    [Fact]
    public void NumberFieldAppearanceReadOnly_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.AppearanceReadOnly, true);

        Assert.Contains("appearance-readonly", numberField.Markup);
    }

    [Fact]
    public void NumberFieldFullBleed_AttributeIsSet()
    {
        var numberField = RenderWithPropertySet(x => x.FullBleed, true);

        Assert.Contains("full-bleed", numberField.Markup);
    }

    [Fact]
    public void NumberField_WithGermanCulture_FormatsValueWithPeriod()
    {
        // Save the current culture to restore it later
        var originalCulture = CultureInfo.CurrentCulture;
        try
        {
            // Set the current culture to German, which uses comma as decimal separator
            CultureInfo.CurrentCulture = new CultureInfo("de-DE");

            var context = new TestContext();
            context.JSInterop.Mode = JSRuntimeMode.Loose;

            // Render the component with a value that has a decimal part
            var numberField = context.RenderComponent<NimbleNumberField>(
                p => p.Add(x => x.Value, 1.5));

            // Verify that the value attribute uses period (.) not comma (,)
            // This is required because the web component expects period regardless of locale
            Assert.Contains("current-value=\"1.5\"", numberField.Markup);
            Assert.DoesNotContain("current-value=\"1,5\"", numberField.Markup);
        }
        finally
        {
            // Restore the original culture
            CultureInfo.CurrentCulture = originalCulture;
        }
    }

    [Fact]
    public void NumberFieldStep_WithGermanCulture_FormatsValueWithPeriod()
    {
        var originalCulture = CultureInfo.CurrentCulture;
        try
        {
            CultureInfo.CurrentCulture = new CultureInfo("de-DE");
            var context = new TestContext();
            context.JSInterop.Mode = JSRuntimeMode.Loose;

            var numberField = context.RenderComponent<NimbleNumberField>(
                p => p.Add(x => x.Step, 1.5));

            Assert.Contains("step=\"1.5\"", numberField.Markup);
            Assert.DoesNotContain("step=\"1,5\"", numberField.Markup);
        }
        finally
        {
            CultureInfo.CurrentCulture = originalCulture;
        }
    }

    [Fact]
    public void NumberFieldMin_WithGermanCulture_FormatsValueWithPeriod()
    {
        var originalCulture = CultureInfo.CurrentCulture;
        try
        {
            CultureInfo.CurrentCulture = new CultureInfo("de-DE");
            var context = new TestContext();
            context.JSInterop.Mode = JSRuntimeMode.Loose;

            var numberField = context.RenderComponent<NimbleNumberField>(
                p => p.Add(x => x.Min, 1.5));

            Assert.Contains("min=\"1.5\"", numberField.Markup);
            Assert.DoesNotContain("min=\"1,5\"", numberField.Markup);
        }
        finally
        {
            CultureInfo.CurrentCulture = originalCulture;
        }
    }

    [Fact]
    public void NumberFieldMax_WithGermanCulture_FormatsValueWithPeriod()
    {
        var originalCulture = CultureInfo.CurrentCulture;
        try
        {
            CultureInfo.CurrentCulture = new CultureInfo("de-DE");
            var context = new TestContext();
            context.JSInterop.Mode = JSRuntimeMode.Loose;

            var numberField = context.RenderComponent<NimbleNumberField>(
                p => p.Add(x => x.Max, 1.5));

            Assert.Contains("max=\"1.5\"", numberField.Markup);
            Assert.DoesNotContain("max=\"1,5\"", numberField.Markup);
        }
        finally
        {
            CultureInfo.CurrentCulture = originalCulture;
        }
    }

    private IRenderedComponent<NimbleNumberField> RenderWithPropertySet<TProperty>(Expression<Func<NimbleNumberField, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleNumberField>(p => p.Add(propertyGetter, propertyValue));
    }
}
