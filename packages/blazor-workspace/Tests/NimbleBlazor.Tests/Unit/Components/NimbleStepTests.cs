using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleStep"/>
/// </summary>
public class NimbleStepTests : BunitTestBase
{
    [Fact]
    public void NimbleStep_Rendered_HasStepMarkup()
    {
        var step = Render<NimbleStep>();

        Assert.NotNull(step.Find("nimble-step"));
    }

    [Fact]
    public void NimbleStep_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleStep>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(StepSeverity.Error, "error")]
    [InlineData(StepSeverity.Warning, "warning")]
    [InlineData(StepSeverity.Success, "success")]
    public void StepSeverity_AttributeIsSet(StepSeverity value, string expectedAttribute)
    {
        var step = RenderWithPropertySet(x => x.Severity, value);

        step.AssertAttribute("severity", expectedAttribute);
    }

    [Fact]
    public void StepSeverityDefault_AttributeIsNotSet()
    {
        var step = RenderWithPropertySet(x => x.Severity, StepSeverity.Default);

        step.AssertAttribute("severity", null);
    }

    [Fact]
    public void StepDisabled_AttributeIsSet()
    {
        var step = RenderWithPropertySet(x => x.Disabled, true);

        step.AssertHasAttribute("disabled");
    }

    [Fact]
    public void StepReadOnly_AttributeIsSet()
    {
        var step = RenderWithPropertySet(x => x.ReadOnly, true);

        step.AssertHasAttribute("readonly");
    }

    [Fact]
    public void StepSelected_AttributeIsSet()
    {
        var step = RenderWithPropertySet(x => x.Selected, true);

        step.AssertHasAttribute("selected");
    }

    private IRenderedComponent<NimbleStep> RenderWithPropertySet<TProperty>(Expression<Func<NimbleStep, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleStep>(p => p.Add(propertyGetter, propertyValue));
    }
}
