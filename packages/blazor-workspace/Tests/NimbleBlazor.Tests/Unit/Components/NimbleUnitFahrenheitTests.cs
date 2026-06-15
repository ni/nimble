using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleUnitFahrenheit"/>
/// </summary>
public class NimbleUnitFahrenheitTests : BunitTestBase
{
    [Fact]
    public void NimbleUnitFahrenheit_Rendered_HasUnitFahrenheitMarkup()
    {
        var element = Render<NimbleUnitFahrenheit>();

        Assert.NotNull(element.Find("nimble-unit-fahrenheit"));
    }

    [Fact]
    public void NimbleUnitFahrenheit_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleUnitFahrenheit>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
