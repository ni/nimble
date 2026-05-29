using System;
using System.Linq;
using System.Linq.Expressions;
using AngleSharp.Dom;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleStepper"/>
/// </summary>
public class NimbleStepperTests
{
    [Fact]
    public void NimbleStepper_Rendered_HasStepperMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-stepper";

        var stepper = context.RenderComponent<NimbleStepper>();

        Assert.Contains(expectedMarkup, stepper.Markup);
    }

    [Fact]
    public void NimbleStepper_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleStepper>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(Orientation.Horizontal, "orientation=\"horizontal\"")]
    [InlineData(Orientation.Vertical, "orientation=\"vertical\"")]
    public void StepperOrientation_AttributeIsSet(Orientation value, string expectedAttribute)
    {
        var stepper = RenderWithPropertySet(x => x.Orientation, value);

        Assert.Contains(expectedAttribute, stepper.Markup);
    }

    [Fact]
    public void NimbleStepperWithChildContent_HasChildMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var stepper = context.RenderComponent<NimbleStepper>(p => p.AddChildContent<NimbleStep>());

        var expectedMarkup = "nimble-step";
        Assert.Contains(expectedMarkup, stepper.Markup);
    }

    private IRenderedComponent<NimbleStepper> RenderWithPropertySet<TProperty>(Expression<Func<NimbleStepper, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleStepper>(p => p.Add(propertyGetter, propertyValue));
    }
}
