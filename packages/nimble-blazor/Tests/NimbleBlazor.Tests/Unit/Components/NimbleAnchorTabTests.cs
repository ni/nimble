using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchorTab"/>.
/// </summary>
public class NimbleAnchorTabTests
{
    [Fact]
    public void NimbleAnchorTab_Render_HasAnchorTabMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-anchor-tab";

        var menuItem = context.RenderComponent<NimbleAnchorTab>();

        Assert.Contains(expectedMarkup, menuItem.Markup);
    }

    [Fact]
    public void AnchorTabHref_AttributeIsSet()
    {
        var anchorTab = RenderWithPropertySet(x => x.Href, "foo");

        Assert.Contains("href=\"foo\"", anchorTab.Markup);
    }

    [Fact]
    public void AnchorTabHrefLang_AttributeIsSet()
    {
        var anchorTab = RenderWithPropertySet(x => x.HrefLang, "foo");

        Assert.Contains("hreflang=\"foo\"", anchorTab.Markup);
    }

    [Fact]
    public void AnchorTabPing_AttributeIsSet()
    {
        var anchorTab = RenderWithPropertySet(x => x.Ping, "foo");

        Assert.Contains("ping=\"foo\"", anchorTab.Markup);
    }

    [Fact]
    public void AnchorTabReferrerPolicy_AttributeIsSet()
    {
        var anchorTab = RenderWithPropertySet(x => x.ReferrerPolicy, "foo");

        Assert.Contains("referrerpolicy=\"foo\"", anchorTab.Markup);
    }

    [Fact]
    public void AnchorTabRel_AttributeIsSet()
    {
        var anchorTab = RenderWithPropertySet(x => x.Rel, "foo");

        Assert.Contains("rel=\"foo\"", anchorTab.Markup);
    }

    [Fact]
    public void AnchorTabTarget_AttributeIsSet()
    {
        var anchorTab = RenderWithPropertySet(x => x.Target, "foo");

        Assert.Contains("target=\"foo\"", anchorTab.Markup);
    }

    [Fact]
    public void AnchorTabType_AttributeIsSet()
    {
        var anchorTab = RenderWithPropertySet(x => x.Type, "foo");

        Assert.Contains("type=\"foo\"", anchorTab.Markup);
    }

    [Fact]
    public void AnchorTabDisabled_AttributeIsSet()
    {
        var anchorTab = RenderWithPropertySet(x => x.Disabled, true);

        Assert.Contains("disabled", anchorTab.Markup);
    }

    private IRenderedComponent<NimbleAnchorTab> RenderWithPropertySet<TProperty>(Expression<Func<NimbleAnchorTab, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleAnchorTab>(p => p.Add(propertyGetter, propertyValue));
    }
}