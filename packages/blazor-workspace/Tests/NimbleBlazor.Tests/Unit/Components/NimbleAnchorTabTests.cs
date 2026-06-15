using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchorTab"/>.
/// </summary>
public class NimbleAnchorTabTests : NimbleAnchorBaseTests<NimbleAnchorTab>
{
    [Fact]
    public void NimbleAnchorTab_Render_HasAnchorTabMarkup()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-anchor-tab";

        var menuItem = context.Render<NimbleAnchorTab>();

        Assert.Contains(expectedMarkup, menuItem.Markup);
    }

    [Fact]
    public void NimbleAnchorTab_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<NimbleAnchorTab>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void AnchorTabDisabled_AttributeIsSet()
    {
        var anchorTab = RenderWithPropertySet(x => x.Disabled, true);

        Assert.Contains("disabled", anchorTab.Markup);
    }

    private IRenderedComponent<NimbleAnchorTab> RenderWithPropertySet<TProperty>(Expression<Func<NimbleAnchorTab, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.Render<NimbleAnchorTab>(p => p.Add(propertyGetter, propertyValue));
    }
}