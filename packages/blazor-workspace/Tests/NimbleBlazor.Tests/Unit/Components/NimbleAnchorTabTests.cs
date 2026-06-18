using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
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
        var menuItem = Render<NimbleAnchorTab>();

        Assert.NotNull(menuItem.Find("nimble-anchor-tab"));
    }

    [Fact]
    public void NimbleAnchorTab_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleAnchorTab>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void AnchorTabDisabled_AttributeIsSet()
    {
        var anchorTab = RenderWithPropertySet(x => x.Disabled, true);

        anchorTab.AssertHasAttribute("disabled");
    }

    private IRenderedComponent<NimbleAnchorTab> RenderWithPropertySet<TProperty>(Expression<Func<NimbleAnchorTab, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleAnchorTab>(p => p.Add(propertyGetter, propertyValue));
    }
}