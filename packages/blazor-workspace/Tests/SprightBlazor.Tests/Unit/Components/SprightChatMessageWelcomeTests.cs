using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChatMessageWelcome"/>.
/// </summary>
public class SprightChatMessageWelcomeTests : BunitTestBase
{
    [Fact]
    public void SprightChatMessageWelcome_Render_HasChatMessageMarkup()
    {
        var component = Render<SprightChatMessageWelcome>();

        Assert.NotNull(component.Find("spright-chat-message-welcome"));
    }

    [Fact]
    public void SprightChatMessageWelcome_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<SprightChatMessageWelcome>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData("Welcome to Nigel", "welcome-title")]
    [InlineData("Log in to continue", "subtitle")]
    public void SprightChatMessageWelcome_AttributeIsSet(string value, string attributeName)
    {
        var message = attributeName == "welcome-title"
            ? RenderWithPropertySet(x => x.WelcomeTitle, value)
            : RenderWithPropertySet(x => x.Subtitle, value);

        message.AssertAttribute(attributeName, value);
    }

    private IRenderedComponent<SprightChatMessageWelcome> RenderWithPropertySet<TProperty>(Expression<Func<SprightChatMessageWelcome, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<SprightChatMessageWelcome>(p => p.Add(propertyGetter, propertyValue));
    }
}