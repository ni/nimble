using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleAnchorMenuItem"/>.
/// </summary>
public class NimbleAnchorMenuItemTests
{
    [Fact]
    public void NimbleAnchorMenuItem_Render_HasAnchorMenuItemMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-anchor-menu-item";

        var menuItem = context.RenderComponent<NimbleAnchorMenuItem>();

        Assert.Contains(expectedMarkup, menuItem.Markup);
    }
}
