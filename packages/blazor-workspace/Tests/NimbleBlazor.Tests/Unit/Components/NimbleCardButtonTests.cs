using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleCardButton"/>.
/// </summary>
public class NimbleCardButtonTests
{
    [Fact]
    public void NimbleCardButton_Render_HasButtonMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-card-button";

        var cardButton = context.RenderComponent<NimbleCardButton>();

        Assert.Contains(expectedMarkup, cardButton.Markup);
    }

    [Fact]
    public void NimbleCardButton_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleCardButton>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }
}
