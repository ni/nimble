using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleRadioGroup"/>
/// </summary>
public class NimbleRadioGroupTests : BunitTestBase
{
    [Fact]
    public void NimbleRadioGroup_Rendered_HasRadioGroupMarkup()
    {
        var radioGroup = Render<NimbleRadioGroup>();

        Assert.NotNull(radioGroup.Find("nimble-radio-group"));
    }

    [Fact]
    public void NimbleRadioGroup_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleRadioGroup>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(Orientation.Horizontal, "horizontal")]
    [InlineData(Orientation.Vertical, "vertical")]
    public void RadioGroupOrientation_AttributeIsSet(Orientation value, string expectedAttribute)
    {
        var radioGroup = RenderNimbleRadioGroup(value);

        radioGroup.AssertAttribute("orientation", expectedAttribute);
    }

    [Fact]
    public void RadioGroupWithButton_HasRadioMarkup()
    {
        var select = RenderNimbleRadioGroupWithButton();

        Assert.NotNull(select.Find("nimble-radio"));
    }

    [Fact]
    public void NimbleRadioGroupDisabled_AttributeIsSet()
    {
        var radioGroup = RenderNimbleRadioGroupWithPropertySet(x => x.Disabled, true);

        radioGroup.AssertHasAttribute("disabled");
    }

    [Fact]
    public void NimbleRadioGroupName_AttributeIsSet()
    {
        var radioGroup = RenderNimbleRadioGroupWithPropertySet(x => x.Name, "foo");

        radioGroup.AssertAttribute("name", "foo");
    }

    [Fact]
    public void NimbleRadioGroupErrorText_AttributeIsSet()
    {
        var radioGroup = RenderNimbleRadioGroupWithPropertySet(x => x.ErrorText, "bad value");

        radioGroup.AssertAttribute("error-text", "bad value");
    }

    [Fact]
    public void NimbleRadioGroupErrorVisible_AttributeIsSet()
    {
        var radioGroup = RenderNimbleRadioGroupWithPropertySet(x => x.ErrorVisible, true);

        radioGroup.AssertHasAttribute("error-visible");
    }

    [Fact]
    public void NimbleRadioGroupRequiredVisible_AttributeIsSet()
    {
        var radioGroup = RenderNimbleRadioGroupWithPropertySet(x => x.RequiredVisible, true);

        radioGroup.AssertHasAttribute("required-visible");
    }

    private IRenderedComponent<NimbleRadioGroup> RenderNimbleRadioGroupWithPropertySet<TProperty>(Expression<Func<NimbleRadioGroup, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleRadioGroup>(p => p.Add(propertyGetter, propertyValue));
    }

    private IRenderedComponent<NimbleRadioGroup> RenderNimbleRadioGroupWithButton()
    {
        return Render<NimbleRadioGroup>(p => p.AddChildContent<NimbleRadio>());
    }

    private IRenderedComponent<NimbleRadioGroup> RenderNimbleRadioGroup(Orientation orientation)
    {
        return Render<NimbleRadioGroup>(p => p.Add(x => x.Orientation, orientation));
    }
}
