using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchorStep"/>.
/// </summary>
public class NimbleAnchorStepTests : NimbleAnchorBaseTests<NimbleAnchorStep>
{
    [Fact]
    public void NimbleAnchorStep_Render_HasAnchorStepMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-anchor-step";

        var anchorStep = context.RenderComponent<NimbleAnchorStep>();

        Assert.Contains(expectedMarkup, anchorStep.Markup);
    }

    [Fact]
    public void NimbleAnchorStep_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleAnchorStep>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(AnchorStepSeverity.Error, "severity=\"error\"")]
    [InlineData(AnchorStepSeverity.Warning, "severity=\"warning\"")]
    [InlineData(AnchorStepSeverity.Success, "severity=\"success\"")]
    public void AnchorAnchorStepSeverity_AttributeIsSet(AnchorStepSeverity value, string expectedAttribute)
    {
        var anchorStep = RenderWithPropertySet(x => x.Severity, value);

        Assert.Contains(expectedAttribute, anchorStep.Markup);
    }

    [Fact]
    public void AnchorAnchorStepSeverityDefault_AttributeIsNotSet()
    {
        var anchorStep = RenderWithPropertySet(x => x.Severity, AnchorStepSeverity.Default);

        Assert.DoesNotContain("severity", anchorStep.Markup);
    }

    [Fact]
    public void AnchorStepDisabled_AttributeIsSet()
    {
        var anchorStep = RenderWithPropertySet(x => x.Disabled, true);

        Assert.Contains("disabled", anchorStep.Markup);
    }

    [Fact]
    public void AnchorStepReadOnly_AttributeIsSet()
    {
        var anchorStep = RenderWithPropertySet(x => x.ReadOnly, true);

        Assert.Contains("readonly", anchorStep.Markup);
    }

    [Fact]
    public void AnchorStepSelected_AttributeIsSet()
    {
        var anchorStep = RenderWithPropertySet(x => x.Selected, true);

        Assert.Contains("selected", anchorStep.Markup);
    }

    private IRenderedComponent<NimbleAnchorStep> RenderWithPropertySet<TProperty>(Expression<Func<NimbleAnchorStep, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleAnchorStep>(p => p.Add(propertyGetter, propertyValue));
    }
}
