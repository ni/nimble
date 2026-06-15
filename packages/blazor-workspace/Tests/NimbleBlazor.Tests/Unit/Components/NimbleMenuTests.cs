using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleMenu"/>
/// </summary>
public class NimbleMenuTests
{
    [Fact]
    public void NimbleMenu_Rendered_HasMenuMarkup()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-menu";

        var menu = context.Render<NimbleMenu>();

        Assert.Contains(expectedMarkup, menu.Markup);
    }

    [Fact]
    public void NimbleMenu_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<NimbleMenu>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
