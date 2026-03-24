using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleUnitFahrenheit"/>
/// </summary>
public class NimbleUnitFahrenheitTests
{
    [Fact]
    public void NimbleUnitFahrenheit_Rendered_HasUnitFahrenheitMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-unit-fahrenheit";

        var element = context.RenderComponent<NimbleUnitFahrenheit>();

        Assert.Contains(expectedMarkup, element.Markup);
    }

    [Fact]
    public void NimbleUnitFahrenheit_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleUnitFahrenheit>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }
}
