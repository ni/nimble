using System;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChatMessageWelcome"/>.
/// </summary>
public class SprightChatMessageWelcomeTests
{
    [Fact]
    public void SprightChatMessageWelcome_Render_HasChatMessageMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-chat-message-welcome";

        var component = context.RenderComponent<SprightChatMessageWelcome>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightChatMessageWelcome_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<SprightChatMessageWelcome>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

}