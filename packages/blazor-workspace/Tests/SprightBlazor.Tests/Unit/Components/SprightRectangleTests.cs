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
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-rectangle";

        var component = context.Render<SprightRectangle>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightRectangle_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<SprightRectangle>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
