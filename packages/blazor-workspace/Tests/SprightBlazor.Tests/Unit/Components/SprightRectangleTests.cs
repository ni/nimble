using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="SprightRectangle"/>.
/// </summary>
public class SprightRectangleTests
{
    [Fact]
    public void SprightRectangle_Render_HasRectangleMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-rectangle";

        var component = context.RenderComponent<SprightRectangle>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightRectangle_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<SprightRectangle>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }
}
