using Bunit;
using Xunit;

namespace OkBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="OkExButton"/>.
/// </summary>
public class OkExButtonTests
{
    [Fact]
    public void OkExButton_Render_HasRectangleMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "ok-ex-button";

        var component = context.RenderComponent<OkExButton>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void OkExButton_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<OkExButton>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }
}
