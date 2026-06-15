using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChatConversation"/>.
/// </summary>
public class SprightChatConversationTests
{
    [Fact]
    public void SprightChatConversation_Render_HasChatConversationMarkup()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-chat-conversation";

        var component = context.Render<SprightChatConversation>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightChatConversation_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<SprightChatConversation>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void SprightChatConversation_WithToolbar_RendersContent()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;

        var component = context.Render<SprightChatConversation>(parameters => parameters
            .AddChildContent("<button slot=\"toolbar\">Toolbar Button</button>"));

        Assert.Contains("slot=\"toolbar\"", component.Markup);
        Assert.Contains("Toolbar Button", component.Markup);
    }
}
