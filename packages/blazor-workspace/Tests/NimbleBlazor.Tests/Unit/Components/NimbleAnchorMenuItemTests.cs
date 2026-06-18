using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchorMenuItem"/>.
/// </summary>
public class NimbleAnchorMenuItemTests : NimbleAnchorBaseTests<NimbleAnchorMenuItem>
{
    [Fact]
    public void NimbleAnchorMenuItem_Render_HasAnchorMenuItemMarkup()
    {
        var menuItem = Render<NimbleAnchorMenuItem>();

        Assert.NotNull(menuItem.Find("nimble-anchor-menu-item"));
    }

    [Fact]
    public void NimbleAnchorMenuItem_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleAnchorMenuItem>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void AnchorMenuItemDisabled_AttributeIsSet()
    {
        var anchorMenuItem = RenderWithPropertySet(x => x.Disabled, true);

        anchorMenuItem.AssertHasAttribute("disabled");
    }

    private IRenderedComponent<NimbleAnchorMenuItem> RenderWithPropertySet<TProperty>(Expression<Func<NimbleAnchorMenuItem, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleAnchorMenuItem>(p => p.Add(propertyGetter, propertyValue));
    }
}
