using AngleSharp.Dom;
using Bunit;
using NimbleBlazor.Components;
using System.Linq;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTabs"/>
/// </summary>
public class NimbleTabsTests
{
    [Fact]
    public void NimbleTabsRendered_HasTabsMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-tabs";
        var tabs = context.RenderComponent<NimbleTabs>();

        Assert.Contains(expectedMarkup, tabs.Markup);
    }

    [Fact]
    public void NimbleTabsWithChildContent_HasChildMarkup()
    {
        var tabs = RenderTabsWithContent();
        var expectedChildrenNames = new[] { "nimble-tab", "nimble-tab-panel", "nimble-tabs-toolbar" };

        var actualChildNodeNames = tabs.Nodes.First().ChildNodes.OfType<IElement>().Select(node => node.LocalName).ToArray();
        Assert.Equal(expectedChildrenNames, actualChildNodeNames);
    }

    private IRenderedComponent<NimbleTabs> RenderTabsWithContent()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTabs>(AddChildContentToTabs);
    }

    private void AddChildContentToTabs(ComponentParameterCollectionBuilder<NimbleTabs> parameters)
    {
        parameters.AddChildContent<NimbleTab>();
        parameters.AddChildContent<NimbleTabPanel>();
        parameters.AddChildContent<NimbleTabsToolbar>();
    }
}
