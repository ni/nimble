using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchor"/>
/// </summary>
public class NimbleAnchorTests
{
    [Fact]
    public void NimbleAnchor_Rendered_HasAnchorMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-anchor";

        var anchor = context.RenderComponent<NimbleAnchor>();

        Assert.Contains(expectedMarkup, anchor.Markup);
    }

    [Theory]
    [InlineData(AnchorAppearance.Default, "<nimble-anchor>")]
    [InlineData(AnchorAppearance.Prominent, "appearance=\"prominent\"")]
    public void AnchorAppearance_AttributeIsSet(AnchorAppearance value, string expectedMarkup)
    {
        var anchor = RenderWithPropertySet(x => x.Appearance, value);

        Assert.Contains(expectedMarkup, anchor.Markup);
    }

    private IRenderedComponent<NimbleAnchor> RenderWithPropertySet<TProperty>(Expression<Func<NimbleAnchor, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleAnchor>(p => p.Add(propertyGetter, propertyValue));
    }
}
