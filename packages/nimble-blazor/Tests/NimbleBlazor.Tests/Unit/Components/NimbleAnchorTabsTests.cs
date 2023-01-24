using System.Linq;
using AngleSharp.Dom;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchorTabs"/>
/// </summary>
public class NimbleAnchorTabsTests
{
    [Fact]
    public void NimbleAnchorTabsRendered_HasTabsMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-anchor-tabs";
        var tabs = context.RenderComponent<NimbleAnchorTabs>();

        Assert.Contains(expectedMarkup, tabs.Markup);
    }

    [Fact]
    public void NimbleAnchorTabsWithChildContent_HasChildMarkup()
    {
        var tabs = RenderTabsWithContent();
        var expectedChildrenNames = new[] { "nimble-anchor-tab", "nimble-anchor-tab", "nimble-tabs-toolbar" };

        var actualChildNodeNames = tabs.Nodes.First().ChildNodes.OfType<IElement>().Select(node => node.LocalName).ToArray();
        Assert.Equal(expectedChildrenNames, actualChildNodeNames);
    }

    [Fact]
    public void NimbleAnchorTabsWithChildContent_HasActiveIdMarkup()
    {
        var tabs = RenderTabsWithContent();

        Assert.Contains("activeid", tabs.Markup);
    }

    [Fact]
    public void NimbleAnchorTabsWithChildContent_HasDisabledMarkup()
    {
        var tabs = RenderTabsWithContent();

        Assert.Contains("disabled", tabs.Markup);
    }

    private IRenderedComponent<NimbleAnchorTabs> RenderTabsWithContent()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleAnchorTabs>(AddChildContentToTabs);
    }

    private void AddChildContentToTabs(ComponentParameterCollectionBuilder<NimbleAnchorTabs> parameters)
    {
        parameters.Add(x => x.ActiveId, "tab1");
        parameters.AddChildContent<NimbleAnchorTab>();
        parameters.AddChildContent<NimbleAnchorTab>(SetTabDisabled);
        parameters.AddChildContent<NimbleTabsToolbar>();
    }

    private void SetTabDisabled(ComponentParameterCollectionBuilder<NimbleAnchorTab> parameters)
    {
        parameters.Add(x => x.Disabled, true);
    }
}
