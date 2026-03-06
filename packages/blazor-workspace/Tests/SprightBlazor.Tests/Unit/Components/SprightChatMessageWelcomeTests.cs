using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChatMessageWelcome"/>.
/// </summary>
public class SprightChatMessageWelcomeTests
{
    [Fact]
    public void SprightChatMessageWelcome_Render_HasChatMessageMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-chat-message-welcome";

        var component = context.RenderComponent<SprightChatMessageWelcome>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightChatMessageWelcome_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<SprightChatMessageWelcome>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData("Welcome to Nigel", "title=\"Welcome to Nigel\"")]
    [InlineData("Log in to continue", "subtitle=\"Log in to continue\"")]
    public void SprightChatMessageWelcome_AttributeIsSet(string value, string expectedAttribute)
    {
        var message = expectedAttribute.StartsWith("title", StringComparison.Ordinal)
            ? RenderWithPropertySet(x => x.Title, value)
            : RenderWithPropertySet(x => x.Subtitle, value);

        Assert.Contains(expectedAttribute, message.Markup);
    }

    private IRenderedComponent<SprightChatMessageWelcome> RenderWithPropertySet<TProperty>(Expression<Func<SprightChatMessageWelcome, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<SprightChatMessageWelcome>(p => p.Add(propertyGetter, propertyValue));
    }
}