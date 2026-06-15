using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleSwitch"/>
/// </summary>
public class NimbleSwitchTests : BunitTestBase
{
    [Fact]
    public void NimbleSwitch_Rendered_HasSwitchMarkup()
    {
        var switchComponent = Render<NimbleSwitch>();

        Assert.NotNull(switchComponent.Find("nimble-switch"));
    }

    [Fact]
    public void NimbleSwitch_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleSwitch>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
