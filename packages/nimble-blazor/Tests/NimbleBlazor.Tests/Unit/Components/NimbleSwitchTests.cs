using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleSwitch"/>
/// </summary>
public class NimbleSwitchTests
{
    [Fact]
    public void NimbleSwitch_Rendered_HasSwitchMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-switch";

        var switchComponent = context.RenderComponent<NimbleSwitch>();

        Assert.Contains(expectedMarkup, switchComponent.Markup);
    }

    [Fact]
    public void NimbleSwitch_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleSwitch>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }
}
