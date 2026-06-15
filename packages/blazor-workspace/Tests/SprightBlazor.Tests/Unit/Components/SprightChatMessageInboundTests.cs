using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChatMessageInbound"/>.
/// </summary>
public class SprightChatMessageInboundTests
{
    [Fact]
    public void SprightChatMessageInbound_Render_HasChatMessageMarkup()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-chat-message-inbound";

        var component = context.Render<SprightChatMessageInbound>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightChatMessageInbound_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<SprightChatMessageInbound>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
