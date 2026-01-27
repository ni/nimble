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
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-chat-message-inbound";

        var component = context.RenderComponent<SprightChatMessageInbound>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightChatMessageInbound_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<SprightChatMessageInbound>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    private IRenderedComponent<SprightChatMessageInbound> RenderWithPropertySet<TProperty>(Expression<Func<SprightChatMessageInbound, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<SprightChatMessageInbound>(p => p.Add(propertyGetter, propertyValue));
    }
}
