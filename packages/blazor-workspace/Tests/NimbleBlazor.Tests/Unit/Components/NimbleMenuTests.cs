using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleMenu"/>
/// </summary>
public class NimbleMenuTests : BunitTestBase
{
    [Fact]
    public void NimbleMenu_Rendered_HasMenuMarkup()
    {
        var menu = Render<NimbleMenu>();

        Assert.NotNull(menu.Find("nimble-menu"));
    }

    [Fact]
    public void NimbleMenu_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleMenu>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
