using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="SprightRectangle"/>.
/// </summary>
public class SprightRectangleTests : BunitTestBase
{
    [Fact]
    public void SprightRectangle_Render_HasRectangleMarkup()
    {
        var component = Render<SprightRectangle>();

        Assert.NotNull(component.Find("spright-rectangle"));
    }

    [Fact]
    public void SprightRectangle_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<SprightRectangle>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
