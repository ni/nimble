using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChatMessage"/>.
/// </summary>
public class SprightChatMessageTests
{
    [Fact]
    public void SprightChatMessage_Render_HasChatConversationMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-chat-message";

        var component = context.RenderComponent<SprightChatMessage>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightChatMessage_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<SprightChatMessage>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(ChatMessageType.Outbound, "message-type=\"outbound\"")]
    [InlineData(ChatMessageType.Inbound, "message-type=\"inbound\"")]
    [InlineData(ChatMessageType.System, "message-type=\"system\"")]
    public void SprightChatMessageTypeVariant_AttributeIsSet(ChatMessageType value, string expectedAttribute)
    {
        var message = RenderWithPropertySet(x => x.MessageType, value);

        Assert.Contains(expectedAttribute, message.Markup);
    }

    private IRenderedComponent<SprightChatMessage> RenderWithPropertySet<TProperty>(Expression<Func<SprightChatMessage, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<SprightChatMessage>(p => p.Add(propertyGetter, propertyValue));
    }
}
