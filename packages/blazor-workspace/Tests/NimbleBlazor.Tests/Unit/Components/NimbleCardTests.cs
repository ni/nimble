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
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-card";

        var card = context.RenderComponent<NimbleCard>();

        Assert.Contains(expectedMarkup, card.Markup);
    }

    [Fact]
    public void NimbleCard_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleCard>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }
}
