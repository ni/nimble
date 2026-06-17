using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChatMessageInbound"/>.
/// </summary>
public class SprightChatMessageInboundTests : BunitTestBase
{
    [Fact]
    public void SprightChatMessageInbound_Render_HasChatMessageMarkup()
    {
        var component = Render<SprightChatMessageInbound>();

        Assert.NotNull(component.Find("spright-chat-message-inbound"));
    }

    [Fact]
    public void SprightChatMessageInbound_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<SprightChatMessageInbound>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
