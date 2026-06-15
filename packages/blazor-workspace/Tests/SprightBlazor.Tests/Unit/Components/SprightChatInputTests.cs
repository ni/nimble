using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChaInputTests"/>.
/// </summary>
public class SprightChatInputTests : BunitTestBase
{
    [Fact]
    public void SprightChatInput_Render_HasChatInputMarkup()
    {
        var component = Render<SprightChatInput>();

        Assert.NotNull(component.Find("spright-chat-input"));
    }

    [Fact]
    public void SprightChatInput_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<SprightChatInput>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void SprightChatInputValue_AttributeIsSet()
    {
        var value = "Tell me something.";
        var chatInput = RenderWithPropertySet(x => x.Value, value);

        chatInput.AssertHasAttribute("value");
    }

    [Fact]
    public void SprightChatInputPlaceholder_AttributeIsSet()
    {
        var placeholder = "Type here...";
        var chatInput = RenderWithPropertySet(x => x.Placeholder, placeholder);

        chatInput.AssertHasAttribute("placeholder");
    }

    [Fact]
    public void SprightChatInputSendButtonLabel_AttributeIsSet()
    {
        var chatInput = RenderWithPropertySet(x => x.SendButtonLabel, "Send now");

        chatInput.AssertHasAttribute("send-button-label");
    }

    [Fact]
    public void SprightChatInputStopButtonLabel_AttributeIsSet()
    {
        var chatInput = RenderWithPropertySet(x => x.StopButtonLabel, "Cancel");

        chatInput.AssertHasAttribute("stop-button-label");
    }

    [Fact]
    public void SprightChatInputSendDisabled_AttributeIsSet()
    {
        var chatInput = RenderWithPropertySet(x => x.SendDisabled, true);

        chatInput.AssertHasAttribute("send-disabled");
    }

    [Fact]
    public void SprightChatInputProcessing_AttributeIsSet()
    {
        var chatInput = RenderWithPropertySet(x => x.Processing, true);

        chatInput.AssertHasAttribute("processing");
    }

    [Fact]
    public void SprightChatInputMaxLength_AttributeIsSet()
    {
        var chatInput = RenderWithPropertySet(x => x.MaxLength, 100);

        chatInput.AssertHasAttribute("maxlength");
    }

    [Fact]
    public void SprightChatInputErrorText_AttributeIsSet()
    {
        var chatInput = RenderWithPropertySet(x => x.ErrorText, "Invalid input");

        chatInput.AssertAttribute("error-text", "Invalid input");
    }

    [Fact]
    public void SprightChatInputErrorVisible_AttributeIsSet()
    {
        var chatInput = RenderWithPropertySet(x => x.ErrorVisible, true);

        chatInput.AssertHasAttribute("error-visible");
    }

    private IRenderedComponent<SprightChatInput> RenderWithPropertySet<TProperty>(Expression<Func<SprightChatInput, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<SprightChatInput>(p => p.Add(propertyGetter, propertyValue));
    }
}
