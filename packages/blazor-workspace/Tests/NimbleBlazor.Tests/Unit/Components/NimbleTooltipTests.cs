using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

#nullable enable

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTooltip"/>.
/// </summary>
public class NimbleTooltipTests : BunitTestBase
{
    [Fact]
    public void NimbleTooltip_Render_HasTooltipMarkup()
    {
        var tooltip = Render<NimbleTooltip>();

        Assert.NotNull(tooltip.Find("nimble-tooltip"));
    }

    [Fact]
    public void NimbleTooltip_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleTooltip>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(TooltipSeverity.Default, null)]
    [InlineData(TooltipSeverity.Error, "error")]
    [InlineData(TooltipSeverity.Information, "information")]
    public void TooltipSeverity_AttributeIsSet(TooltipSeverity value, string? expectedValue)
    {
        var tooltip = RenderWithPropertySet(x => x.Severity, value);

        tooltip.AssertAttribute("severity", expectedValue);
    }

    [Fact]
    public void TooltipIconVisible_AttributeIsSet()
    {
        var tooltip = RenderWithPropertySet(x => x.IconVisible, true);

        tooltip.AssertHasAttribute("icon-visible");
    }

    private IRenderedComponent<NimbleTooltip> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTooltip, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleTooltip>(p => p.Add(propertyGetter, propertyValue));
    }
}
