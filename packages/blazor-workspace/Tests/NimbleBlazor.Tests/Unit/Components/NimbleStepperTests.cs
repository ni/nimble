using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleStepper"/>
/// </summary>
public class NimbleStepperTests : BunitTestBase
{
    [Fact]
    public void NimbleStepper_Rendered_HasStepperMarkup()
    {
        var stepper = Render<NimbleStepper>();

        Assert.NotNull(stepper.Find("nimble-stepper"));
    }

    [Fact]
    public void NimbleStepper_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleStepper>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(Orientation.Horizontal, "horizontal")]
    [InlineData(Orientation.Vertical, "vertical")]
    public void StepperOrientation_AttributeIsSet(Orientation value, string expectedAttribute)
    {
        var stepper = RenderWithPropertySet(x => x.Orientation, value);

        stepper.AssertAttribute("orientation", expectedAttribute);
    }

    [Fact]
    public void NimbleStepperWithChildContent_HasChildMarkup()
    {
        var stepper = Render<NimbleStepper>(p => p.AddChildContent<NimbleStep>());

        Assert.NotNull(stepper.Find("nimble-step"));
    }

    private IRenderedComponent<NimbleStepper> RenderWithPropertySet<TProperty>(Expression<Func<NimbleStepper, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleStepper>(p => p.Add(propertyGetter, propertyValue));
    }
}
