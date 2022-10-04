using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTooltip"/>.
/// </summary>
public class NimbleTooltipTests
{
    [Fact]
    public void NimbleTooltip_Render_HasTooltipMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-tooltip";

        var tooltip = context.RenderComponent<NimbleTooltip>();

        Assert.Contains(expectedMarkup, tooltip.Markup);
    }

    [Theory]
    [InlineData(TooltipSeverity.Default, "<nimble-tooltip>")]
    [InlineData(TooltipSeverity.Error, "severity=\"error\"")]
    [InlineData(TooltipSeverity.Information, "severity=\"information\"")]
    public void TooltipSeverity_AttributeIsSet(TooltipSeverity value, string expectedAttribute)
    {
        var tooltip = RenderWithPropertySet(x => x.Severity, value);

        Assert.Contains(expectedAttribute, tooltip.Markup);
    }

    [Fact]
    public void TooltipIconVisible_AttributeIsSet()
    {
        var tooltip = RenderWithPropertySet(x => x.IconVisible, true);

        Assert.Contains("icon-visible", tooltip.Markup);
    }

    private IRenderedComponent<NimbleTooltip> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTooltip, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTooltip>(p => p.Add(propertyGetter, propertyValue));
    }
}
