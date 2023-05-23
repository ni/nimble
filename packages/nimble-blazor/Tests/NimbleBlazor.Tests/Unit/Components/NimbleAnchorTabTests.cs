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
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-anchor-tab";

        var menuItem = context.RenderComponent<NimbleAnchorTab>();

        Assert.Contains(expectedMarkup, menuItem.Markup);
    }

    [Fact]
    public void NimbleAnchorTab_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleAnchorTab>(ComponentParameter.CreateParameter("class", "foo")));
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
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleAnchorTab>(p => p.Add(propertyGetter, propertyValue));
    }
}