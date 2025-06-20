using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChatInput"/>.
/// </summary>
public class SprightChatInputTests
{
    [Fact]
    public void SprightChatInput_Render_HasChatConversationMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-chat-input";

        var component = context.RenderComponent<SprightChatInput>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightChatInput_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<SprightChatInput>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }
}
