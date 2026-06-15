using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleUnitVolt"/>
/// </summary>
public class NimbleUnitVoltTests : BunitTestBase
{
    [Fact]
    public void NimbleUnitVolt_Rendered_HasUnitVoltMarkup()
    {
        var element = Render<NimbleUnitVolt>();

        Assert.NotNull(element.Find("nimble-unit-volt"));
    }

    [Fact]
    public void NimbleUnitVolt_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleUnitVolt>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
