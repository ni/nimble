using Bunit;
using Xunit;

namespace OkBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="OkButton"/>.
/// </summary>
public class OkButtonTests
{
    [Fact]
    public void OkButton_Render_HasRectangleMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "ok-button";

        var component = context.RenderComponent<OkButton>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void OkButton_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<OkButton>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }
}
