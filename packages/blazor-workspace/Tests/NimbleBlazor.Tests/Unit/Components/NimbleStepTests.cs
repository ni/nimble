using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleStep"/>
/// </summary>
public class NimbleStepTests
{
    [Fact]
    public void NimbleStep_Rendered_HasStepMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-step";

        var step = context.RenderComponent<NimbleStep>();

        Assert.Contains(expectedMarkup, step.Markup);
    }

    [Fact]
    public void NimbleStep_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleStep>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(StepSeverity.Error, "severity=\"error\"")]
    [InlineData(StepSeverity.Warning, "severity=\"warning\"")]
    [InlineData(StepSeverity.Success, "severity=\"success\"")]
    public void StepSeverity_AttributeIsSet(StepSeverity value, string expectedAttribute)
    {
        var step = RenderWithPropertySet(x => x.Severity, value);

        Assert.Contains(expectedAttribute, step.Markup);
    }

    [Fact]
    public void StepSeverityDefault_AttributeIsNotSet()
    {
        var step = RenderWithPropertySet(x => x.Severity, StepSeverity.Default);

        Assert.DoesNotContain("severity", step.Markup);
    }

    [Fact]
    public void StepDisabled_AttributeIsSet()
    {
        var step = RenderWithPropertySet(x => x.Disabled, true);

        Assert.Contains("disabled", step.Markup);
    }

    [Fact]
    public void StepReadOnly_AttributeIsSet()
    {
        var step = RenderWithPropertySet(x => x.ReadOnly, true);

        Assert.Contains("readonly", step.Markup);
    }

    [Fact]
    public void StepSelected_AttributeIsSet()
    {
        var step = RenderWithPropertySet(x => x.Selected, true);

        Assert.Contains("selected", step.Markup);
    }

    private IRenderedComponent<NimbleStep> RenderWithPropertySet<TProperty>(Expression<Func<NimbleStep, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleStep>(p => p.Add(propertyGetter, propertyValue));
    }
}
