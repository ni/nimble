using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="SprightChatMessageSystem"/>.
/// </summary>
public class SprightChatMessageSystemTests : BunitTestBase
{
    [Fact]
    public void SprightChatMessageSystem_Render_HasChatMessageMarkup()
    {
        var component = Render<SprightChatMessageSystem>();

        Assert.NotNull(component.Find("spright-chat-message-system"));
    }

    [Fact]
    public void SprightChatMessageSystem_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<SprightChatMessageSystem>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}