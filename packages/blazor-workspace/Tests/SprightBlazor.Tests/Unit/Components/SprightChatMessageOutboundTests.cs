using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChatMessageOutbound"/>.
/// </summary>
public class SprightChatMessageOutboundTests : BunitTestBase
{
    [Fact]
    public void SprightChatMessageOutbound_Render_HasChatMessageMarkup()
    {
        var component = Render<SprightChatMessageOutbound>();

        Assert.NotNull(component.Find("spright-chat-message-outbound"));
    }

    [Fact]
    public void SprightChatMessageOutbound_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<SprightChatMessageOutbound>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
