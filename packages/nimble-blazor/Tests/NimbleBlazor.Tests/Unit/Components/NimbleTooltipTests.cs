using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTooltip"/>.
/// </summary>
public class NimbleTooltipTests
{
    [Fact]
    public void NimbleTooltip_Render_HasTooltipMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-tooltip";

        var tooltip = context.RenderComponent<NimbleTooltip>();

        Assert.Contains(expectedMarkup, tooltip.Markup);
    }
}
