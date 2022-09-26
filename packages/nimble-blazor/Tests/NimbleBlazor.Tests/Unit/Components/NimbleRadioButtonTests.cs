using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleRadioButton"/>
/// </summary>
public class NimbleRadioButtonTests
{
    [Fact]
    public void NimbleRadioButton_Rendered_HasRadioButtonMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-radio-button";

        var radioButton = context.RenderComponent<NimbleRadioButton>();

        Assert.Contains(expectedMarkup, radioButton.Markup);
    }

    [Fact]
    public void NimbleRadioButtonCurrentValue_AttributeIsSet()
    {
        var radioButton = RenderNimbleRadioButtonWithPropertySet(x => x.CurrentValue, "foo");

        Assert.Contains("current-value", radioButton.Markup);
    }

    [Fact]
    public void NimbleRadioButtonDisabled_AttributeIsSet()
    {
        var radioButton = RenderNimbleRadioButtonWithPropertySet(x => x.Disabled, true);

        Assert.Contains("disabled", radioButton.Markup);
    }

    [Fact]
    public void NimbleRadioButtonName_AttributeIsSet()
    {
        var radioButton = RenderNimbleRadioButtonWithPropertySet(x => x.Name, "buttons");

        Assert.Contains("name", radioButton.Markup);
    }

    [Fact]
    public void NimbleRadioButtonChecked_AttributeIsSet()
    {
        var radioButton = RenderNimbleRadioButtonWithPropertySet(x => x.Checked, true);

        Assert.Contains("checked", radioButton.Markup);
    }

    private IRenderedComponent<NimbleRadioButton> RenderNimbleRadioButtonWithPropertySet<TProperty>(Expression<Func<NimbleRadioButton, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleRadioButton>(p => p.Add(propertyGetter, propertyValue));
    }
}
