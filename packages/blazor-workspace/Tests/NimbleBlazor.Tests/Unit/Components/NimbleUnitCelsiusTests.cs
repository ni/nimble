using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleUnitCelsius"/>
/// </summary>
public class NimbleUnitCelsiusTests : BunitTestBase
{
    [Fact]
    public void NimbleUnitCelsius_Rendered_HasUnitCelsiusMarkup()
    {
        var element = Render<NimbleUnitCelsius>();

        Assert.NotNull(element.Find("nimble-unit-celsius"));
    }

    [Fact]
    public void NimbleUnitCelsius_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleUnitCelsius>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
