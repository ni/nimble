using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleIconCheck"/>.
/// </summary>
public class NimbleIconCheckTests
{
    [Fact]
    public void NimbleIconCheck_Render_HasButtonMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-icon-check";

        var icon = context.RenderComponent<NimbleIconCheck>();

        Assert.Contains(expectedMarkup, icon.Markup);
    }

    [Theory]
    [InlineData(IconSeverity.Default, "<nimble-icon-check>")]
    [InlineData(IconSeverity.Error, "severity=\"error\"")]
    [InlineData(IconSeverity.Information, "severity=\"information\"")]
    [InlineData(IconSeverity.Success, "severity=\"success\"")]
    [InlineData(IconSeverity.Warning, "severity=\"warning\"")]
    public void IconSeverity_AttributeIsSet(IconSeverity value, string expectedAttribute)
    {
        var icon = RenderWithPropertySet(x => x.Severity, value);

        Assert.Contains(expectedAttribute, icon.Markup);
    }

    private IRenderedComponent<NimbleIconCheck> RenderWithPropertySet<TProperty>(Expression<Func<NimbleIconCheck, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleIconCheck>(p => p.Add(propertyGetter, propertyValue));
    }
}
