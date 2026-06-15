using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleCard"/>
/// </summary>
public class NimbleCardTests : BunitTestBase
{
    [Fact]
    public void NimbleCard_Rendered_HasCardMarkup()
    {
        var card = Render<NimbleCard>();

        Assert.NotNull(card.Find("nimble-card"));
    }

    [Fact]
    public void NimbleCard_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleCard>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
