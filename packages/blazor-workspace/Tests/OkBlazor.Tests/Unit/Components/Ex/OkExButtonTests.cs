using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace OkBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="OkExButton"/>.
/// </summary>
public class OkExButtonTests : BunitTestBase
{
    [Fact]
    public void OkExButton_Render_HasRectangleMarkup()
    {
        var component = Render<OkExButton>();

        Assert.NotNull(component.Find("ok-ex-button"));
    }

    [Fact]
    public void OkExButton_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<OkExButton>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }
}
