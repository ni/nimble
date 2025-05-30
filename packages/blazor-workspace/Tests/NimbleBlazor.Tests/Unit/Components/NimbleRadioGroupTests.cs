using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleRadioGroup"/>
/// </summary>
public class NimbleRadioGroupTests
{
    [Fact]
    public void NimbleRadioGroup_Rendered_HasRadioGroupMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-radio-group";

        var radioGroup = context.RenderComponent<NimbleRadioGroup>();

        Assert.Contains(expectedMarkup, radioGroup.Markup);
    }

    [Fact]
    public void NimbleRadioGroup_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleRadioGroup>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(Orientation.Horizontal, "horizontal")]
    [InlineData(Orientation.Vertical, "vertical")]
    public void RadioGroupOrientation_AttributeIsSet(Orientation value, string expectedAttribute)
    {
        var radioGroup = RenderNimbleRadioGroup(value);

        Assert.Contains(expectedAttribute, radioGroup.Markup);
    }

    [Fact]
    public void RadioGroupWithButton_HasRadioMarkup()
    {
        var expectedMarkup = "nimble-radio";
        var select = RenderNimbleRadioGroupWithButton();

        Assert.Contains(expectedMarkup, select.Markup);
    }

    [Fact]
    public void NimbleRadioGroupDisabled_AttributeIsSet()
    {
        var radioGroup = RenderNimbleRadioGroupWithPropertySet(x => x.Disabled, true);

        Assert.Contains("disabled", radioGroup.Markup);
    }

    [Fact]
    public void NimbleRadioGroupName_AttributeIsSet()
    {
        var radioGroup = RenderNimbleRadioGroupWithPropertySet(x => x.Name, "foo");

        Assert.Contains("name", radioGroup.Markup);
    }

    [Fact]
    public void NimbleRadioGroupErrorText_AttributeIsSet()
    {
        var radioGroup = RenderNimbleRadioGroupWithPropertySet(x => x.ErrorText, "bad value");

        Assert.Contains("error-text=\"bad value\"", radioGroup.Markup);
    }

    [Fact]
    public void NimbleRadioGroupErrorVisible_AttributeIsSet()
    {
        var radioGroup = RenderNimbleRadioGroupWithPropertySet(x => x.ErrorVisible, true);

        Assert.Contains("error-visible", radioGroup.Markup);
    }

    [Fact]
    public void NimbleRadioGroupRequiredVisible_AttributeIsSet()
    {
        var radioGroup = RenderNimbleRadioGroupWithPropertySet(x => x.RequiredVisible, true);

        Assert.Contains("required-visible", radioGroup.Markup);
    }

    private IRenderedComponent<NimbleRadioGroup> RenderNimbleRadioGroupWithPropertySet<TProperty>(Expression<Func<NimbleRadioGroup, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleRadioGroup>(p => p.Add(propertyGetter, propertyValue));
    }

    private IRenderedComponent<NimbleRadioGroup> RenderNimbleRadioGroupWithButton()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleRadioGroup>(p => p.AddChildContent<NimbleRadio>());
    }

    private IRenderedComponent<NimbleRadioGroup> RenderNimbleRadioGroup(Orientation orientation)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleRadioGroup>(p => p.Add(x => x.Orientation, orientation));
    }
}
