using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

#nullable enable

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchor"/>
/// </summary>
public class NimbleAnchorTests : NimbleAnchorBaseTests<NimbleAnchor>
{
    [Fact]
    public void NimbleAnchor_Rendered_HasAnchorMarkup()
    {
        var anchor = Render<NimbleAnchor>();

        Assert.NotNull(anchor.Find("nimble-anchor"));
    }

    [Fact]
    public void NimbleAnchor_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleAnchor>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(AnchorAppearance.Default, null)]
    [InlineData(AnchorAppearance.Prominent, "prominent")]
    public void AnchorAppearance_AttributeIsSet(AnchorAppearance value, string? expectedValue)
    {
        var anchor = RenderWithPropertySet(x => x.Appearance, value);

        anchor.AssertAttribute("appearance", expectedValue);
    }

    [Fact]
    public void AnchorContentEditable_AttributeIsSet()
    {
        var anchor = RenderWithPropertySet(x => x.ContentEditable, "true");

        anchor.AssertAttribute("contenteditable", "true");
    }

    [Fact]
    public void AnchorUnderlineHidden_AttributeIsSet()
    {
        var anchor = RenderWithPropertySet(x => x.UnderlineHidden, true);

        anchor.AssertHasAttribute("underline-hidden");
    }

    private IRenderedComponent<NimbleAnchor> RenderWithPropertySet<TProperty>(Expression<Func<NimbleAnchor, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleAnchor>(p => p.Add(propertyGetter, propertyValue));
    }
}
