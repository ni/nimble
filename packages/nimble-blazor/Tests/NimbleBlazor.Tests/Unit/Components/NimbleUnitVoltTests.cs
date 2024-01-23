using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleUnitVolt"/>
/// </summary>
public class NimbleUnitVoltTests
{
    [Fact]
    public void NimbleUnitVolt_Rendered_HasUnitVoltMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-unit-volt";

        var element = context.RenderComponent<NimbleUnitVolt>();

        Assert.Contains(expectedMarkup, element.Markup);
    }

    [Fact]
    public void NimbleUnitVolt_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleUnitVolt>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }
}
