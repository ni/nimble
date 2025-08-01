using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChaInputTests"/>.
/// </summary>
public class SprightChatInputTests
{
    [Fact]
    public void SprightChatInput_Render_HasChatInputMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-chat-input";

        var component = context.RenderComponent<SprightChatInput>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightChatInput_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<SprightChatInput>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void SprightChatInputValue_AttributeIsSet()
    {
        var value = "Tell me something.";
        var chatInput = RenderWithPropertySet(x => x.Value, value);

        Assert.Contains("value", chatInput.Markup);
    }

    [Fact]
    public void SprightChatInputPlaceholder_AttributeIsSet()
    {
        var placeholder = "Type here...";
        var chatInput = RenderWithPropertySet(x => x.Placeholder, placeholder);

        Assert.Contains("placeholder", chatInput.Markup);
    }

    private IRenderedComponent<SprightChatInput> RenderWithPropertySet<TProperty>(Expression<Func<SprightChatInput, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<SprightChatInput>(p => p.Add(propertyGetter, propertyValue));
    }
}
