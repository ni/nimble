using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChatMessage"/>.
/// </summary>
public class SprightChatMessageTests : BunitTestBase
{
    [Fact]
    public void SprightChatMessage_Render_HasChatMessageMarkup()
    {
        var component = Render<SprightChatMessage>();

        Assert.NotNull(component.Find("spright-chat-message"));
    }

    [Fact]
    public void SprightChatMessage_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<SprightChatMessage>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(ChatMessageType.Outbound, "outbound")]
    [InlineData(ChatMessageType.Inbound, "inbound")]
    [InlineData(ChatMessageType.System, "system")]
    public void SprightChatMessageTypeVariant_AttributeIsSet(ChatMessageType value, string expectedAttribute)
    {
        var message = RenderWithPropertySet(x => x.MessageType, value);

        message.AssertAttribute("message-type", expectedAttribute);
    }

    private IRenderedComponent<SprightChatMessage> RenderWithPropertySet<TProperty>(Expression<Func<SprightChatMessage, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<SprightChatMessage>(p => p.Add(propertyGetter, propertyValue));
    }
}
