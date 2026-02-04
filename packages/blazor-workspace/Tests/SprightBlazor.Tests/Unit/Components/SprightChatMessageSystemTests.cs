using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChatMessageSystem"/>.
/// </summary>
public class SprightChatMessageSystemTests
{
    [Fact]
    public void SprightChatMessageSystem_Render_HasChatMessageMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-chat-message-system";

        var component = context.RenderComponent<SprightChatMessageSystem>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightChatMessageSystem_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<SprightChatMessageSystem>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }
}