using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleCard"/>
/// </summary>
public class NimbleCardTests
{
    [Fact]
    public void NimbleCard_Rendered_HasCardMarkup()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-card";

        var card = context.Render<NimbleCard>();

        Assert.Contains(expectedMarkup, card.Markup);
    }

    [Fact]
    public void NimbleCard_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<NimbleCard>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
