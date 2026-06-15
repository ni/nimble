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
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-chat-message-welcome";

        var component = context.Render<SprightChatMessageWelcome>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightChatMessageWelcome_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<SprightChatMessageWelcome>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData("Welcome to Nigel", "welcome-title=\"Welcome to Nigel\"")]
    [InlineData("Log in to continue", "subtitle=\"Log in to continue\"")]
    public void SprightChatMessageWelcome_AttributeIsSet(string value, string expectedAttribute)
    {
        var message = expectedAttribute.StartsWith("welcome-title", StringComparison.Ordinal)
            ? RenderWithPropertySet(x => x.WelcomeTitle, value)
            : RenderWithPropertySet(x => x.Subtitle, value);

        Assert.Contains(expectedAttribute, message.Markup);
    }

    private IRenderedComponent<SprightChatMessageWelcome> RenderWithPropertySet<TProperty>(Expression<Func<SprightChatMessageWelcome, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.Render<SprightChatMessageWelcome>(p => p.Add(propertyGetter, propertyValue));
    }
}