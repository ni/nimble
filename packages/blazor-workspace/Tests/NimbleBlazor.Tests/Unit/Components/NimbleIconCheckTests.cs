using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleIconCheck"/>.
/// </summary>
public class NimbleIconCheckTests : BunitTestBase
{
    [Fact]
    public void NimbleIconCheck_Render_HasButtonMarkup()
    {
        var icon = Render<NimbleIconCheck>();

        Assert.NotNull(icon.Find("nimble-icon-check"));
    }

    [Fact]
    public void NimbleIconCheck_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleIconCheck>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(IconSeverity.Default, null)]
    [InlineData(IconSeverity.Error, "error")]
    [InlineData(IconSeverity.Information, "information")]
    [InlineData(IconSeverity.Success, "success")]
    [InlineData(IconSeverity.Warning, "warning")]
    public void IconSeverity_AttributeIsSet(IconSeverity value, string? expectedAttribute)
    {
        var icon = RenderWithPropertySet(x => x.Severity, value);

        icon.AssertAttribute("severity", expectedAttribute);
    }

    private IRenderedComponent<NimbleIconCheck> RenderWithPropertySet<TProperty>(Expression<Func<NimbleIconCheck, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleIconCheck>(p => p.Add(propertyGetter, propertyValue));
    }
}
