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
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "ok-ex-button";

        var component = context.Render<OkExButton>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void OkExButton_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<OkExButton>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
