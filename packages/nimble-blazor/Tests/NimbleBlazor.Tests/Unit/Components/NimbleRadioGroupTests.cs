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

    [Theory]
    [InlineData(Orientation.Horizontal, "horizontal")]
    [InlineData(Orientation.Vertical, "vertical")]
    public void RadioGroupOrientation_AttributeIsSet(Orientation value, string expectedAttribute)
    {
        var radioGroup = RenderNimbleRadioGroup(value);

        Assert.Contains(expectedAttribute, radioGroup.Markup);
    }

    [Fact]
    public void RadioGroupWithButton_HasRadioButtonMarkup()
    {
        var expectedMarkup = "nimble-radio-button";
        var select = RenderNimbleRadioGroupWithButton();

        Assert.Contains(expectedMarkup, select.Markup);
    }

    private IRenderedComponent<NimbleRadioGroup> RenderNimbleRadioGroupWithButton()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleRadioGroup>(p => p.AddChildContent<NimbleRadioButton>());
    }

    private IRenderedComponent<NimbleRadioGroup> RenderNimbleRadioGroup(Orientation orientation)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleRadioGroup>(p => p.Add(x => x.Orientation, orientation));
    }
}
