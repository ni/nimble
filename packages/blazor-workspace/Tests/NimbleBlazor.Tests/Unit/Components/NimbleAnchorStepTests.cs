using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
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
        var anchorStep = Render<NimbleAnchorStep>();

        Assert.NotNull(anchorStep.Find("nimble-anchor-step"));
    }

    [Fact]
    public void NimbleAnchorStep_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleAnchorStep>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(AnchorStepSeverity.Error, "error")]
    [InlineData(AnchorStepSeverity.Warning, "warning")]
    [InlineData(AnchorStepSeverity.Success, "success")]
    public void AnchorAnchorStepSeverity_AttributeIsSet(AnchorStepSeverity value, string expectedAttribute)
    {
        var anchorStep = RenderWithPropertySet(x => x.Severity, value);

        anchorStep.AssertAttribute("severity", expectedAttribute);
    }

    [Fact]
    public void AnchorAnchorStepSeverityDefault_AttributeIsNotSet()
    {
        var anchorStep = RenderWithPropertySet(x => x.Severity, AnchorStepSeverity.Default);

        anchorStep.AssertAttribute("severity", null);
    }

    [Fact]
    public void AnchorStepDisabled_AttributeIsSet()
    {
        var anchorStep = RenderWithPropertySet(x => x.Disabled, true);

        anchorStep.AssertHasAttribute("disabled");
    }

    [Fact]
    public void AnchorStepReadOnly_AttributeIsSet()
    {
        var anchorStep = RenderWithPropertySet(x => x.ReadOnly, true);

        anchorStep.AssertHasAttribute("readonly");
    }

    [Fact]
    public void AnchorStepSelected_AttributeIsSet()
    {
        var anchorStep = RenderWithPropertySet(x => x.Selected, true);

        anchorStep.AssertHasAttribute("selected");
    }

    private IRenderedComponent<NimbleAnchorStep> RenderWithPropertySet<TProperty>(Expression<Func<NimbleAnchorStep, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleAnchorStep>(p => p.Add(propertyGetter, propertyValue));
    }
}
