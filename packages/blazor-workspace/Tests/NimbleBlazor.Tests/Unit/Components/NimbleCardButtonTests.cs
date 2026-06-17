using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleCardButton"/>.
/// </summary>
public class NimbleCardButtonTests : BunitTestBase
{
    [Fact]
    public void NimbleCardButton_Render_HasButtonMarkup()
    {
        var cardButton = Render<NimbleCardButton>();

        Assert.NotNull(cardButton.Find("nimble-card-button"));
    }

    [Fact]
    public void NimbleCardButton_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleCardButton>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
