using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChatMessageOutbound"/>.
/// </summary>
public class SprightChatMessageOutboundTests
{
    [Fact]
    public void SprightChatMessageOutbound_Render_HasChatMessageMarkup()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-chat-message-outbound";

        var component = context.Render<SprightChatMessageOutbound>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightChatMessageOutbound_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<SprightChatMessageOutbound>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
