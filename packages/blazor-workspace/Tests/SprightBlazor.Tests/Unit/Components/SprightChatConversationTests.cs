using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChatConversation"/>.
/// </summary>
public class SprightChatConversationTests : BunitTestBase
{
    [Fact]
    public void SprightChatConversation_Render_HasChatConversationMarkup()
    {
        var component = Render<SprightChatConversation>();

        Assert.NotNull(component.Find("spright-chat-conversation"));
    }

    [Fact]
    public void SprightChatConversation_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<SprightChatConversation>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void SprightChatConversation_WithToolbar_RendersContent()
    {
        var component = Render<SprightChatConversation>(parameters => parameters
            .AddChildContent("<button slot=\"toolbar\">Toolbar Button</button>"));

        var toolbarButton = component.Find("button[slot=\"toolbar\"]");
        Assert.Equal("Toolbar Button", toolbarButton.TextContent);
    }

    [Fact]
    public void SprightChatConversation_AutoScroll_AttributeIsSet()
    {
        var component = RenderWithPropertySet(x => x.AutoScroll, true);

        Assert.Contains("auto-scroll", component.Markup);
    }

    private IRenderedComponent<SprightChatConversation> RenderWithPropertySet<TProperty>(Expression<Func<SprightChatConversation, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<SprightChatConversation>(p => p.Add(propertyGetter, propertyValue));
    }
}
