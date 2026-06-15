using System.Linq;
using AngleSharp.Dom;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchorTabs"/>
/// </summary>
public class NimbleAnchorTabsTests : BunitTestBase
{
    [Fact]
    public void NimbleAnchorTabsRendered_HasTabsMarkup()
    {
        var tabs = Render<NimbleAnchorTabs>();

        Assert.NotNull(tabs.Find("nimble-anchor-tabs"));
    }

    [Fact]
    public void NimbleAnchorTabs_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleAnchorTabs>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
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

        tabs.AssertAttribute("activeid", "tab1");
    }

    [Fact]
    public void NimbleAnchorTabsWithChildContent_HasDisabledMarkup()
    {
        var tabs = RenderTabsWithContent();
        Assert.Contains("disabled", tabs.Markup);
    }

    private IRenderedComponent<NimbleAnchorTabs> RenderTabsWithContent()
    {
        return Render<NimbleAnchorTabs>(AddChildContentToTabs);
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
