using System.Linq;
using System.Threading.Tasks;
using AngleSharp.Dom;
using Bunit;
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

    [Fact]
    public async void NimbleTabs_ChangeActiveIdToNull_ActiveTabIdDoesNotSwitch()
    {
        var expectedActiveTabId = "tab1";
        var tabs = CreateTwoTabsWithActiveTabIdSet(expectedActiveTabId);

        await TriggerNimbleTabsActiveIdChangeEventAsync(tabs, eventArgs: null);

        Assert.Equal(expectedActiveTabId, tabs.Instance.ActiveId);
    }

    [Fact]
    public async void NimbleTabs_ChangeActiveId_ActiveTabUpdates()
    {
        var expectedActiveTabId = "tab2";
        var eventArgs = new TabsChangeEventArgs { ActiveId = expectedActiveTabId };
        var tabs = CreateTwoTabsWithActiveTabIdSet(activeTabId: "tab1");

        await TriggerNimbleTabsActiveIdChangeEventAsync(tabs, eventArgs);

        Assert.Equal(expectedActiveTabId, tabs.Instance.ActiveId);
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

    private IRenderedComponent<NimbleTabs> CreateTwoTabsWithActiveTabIdSet(string activeTabId)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var tabComponent = context.RenderComponent<NimbleTabs>(parameters =>
        {
            parameters.Add(x => x.ActiveId, activeTabId);
            parameters.AddChildContent<NimbleTab>();
            parameters.AddChildContent<NimbleTab>();
            parameters.AddChildContent<NimbleTabPanel>();
            parameters.AddChildContent<NimbleTabPanel>();
        });

        Assert.Equal(activeTabId, tabComponent.Instance.ActiveId);

        return tabComponent;
    }

    private async Task TriggerNimbleTabsActiveIdChangeEventAsync(
        IRenderedComponent<NimbleTabs> tabs,
        TabsChangeEventArgs eventArgs)
    {
        var tabsElement = tabs.Find("nimble-tabs");

        await tabsElement.TriggerEventAsync("onnimbletabsactiveidchange", eventArgs);
    }
}
