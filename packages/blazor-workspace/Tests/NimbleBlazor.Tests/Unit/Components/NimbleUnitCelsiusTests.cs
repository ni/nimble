using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleUnitCelsius"/>
/// </summary>
public class NimbleUnitCelsiusTests
{
    [Fact]
    public void NimbleUnitCelsius_Rendered_HasUnitCelsiusMarkup()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-unit-celsius";

        var element = context.Render<NimbleUnitCelsius>();

        Assert.Contains(expectedMarkup, element.Markup);
    }

    [Fact]
    public void NimbleUnitCelsius_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<NimbleUnitCelsius>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
