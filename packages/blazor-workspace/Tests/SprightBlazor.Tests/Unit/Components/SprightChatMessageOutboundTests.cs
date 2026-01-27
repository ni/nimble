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
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-chat-message-outbound";

        var component = context.RenderComponent<SprightChatMessageOutbound>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightChatMessageOutbound_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<SprightChatMessageOutbound>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    private IRenderedComponent<SprightChatMessageOutbound> RenderWithPropertySet<TProperty>(Expression<Func<SprightChatMessageOutbound, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<SprightChatMessageOutbound>(p => p.Add(propertyGetter, propertyValue));
    }
}
