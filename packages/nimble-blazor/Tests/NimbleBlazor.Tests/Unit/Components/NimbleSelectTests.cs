using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleSelect"/>
/// </summary>
public class NimbleSelectTests
{
    [Fact]
    public void NimbleSelect_Rendered_HasSelectMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-select";

        var select = context.RenderComponent<NimbleSelect>();

        Assert.Contains(expectedMarkup, select.Markup);
    }

    [Theory]
    [InlineData(Position.Below, "below")]
    [InlineData(Position.Above, "above")]
    public void SelectPosition_AttributeIsSet(Position value, string expectedAttribute)
    {
        var select = RenderNimbleSelect(value);

        Assert.Contains(expectedAttribute, select.Markup);
    }

    [Fact]
    public void SelectWithOption_HasListOptionMarkup()
    {
        var expectedMarkup = "nimble-list-option";
        var select = RenderNimbleSelectWithOption();

        Assert.Contains(expectedMarkup, select.Markup);
    }

    [Theory]
    [InlineData(DropdownAppearance.Outline, "outline")]
    [InlineData(DropdownAppearance.Block, "block")]
    [InlineData(DropdownAppearance.Underline, "underline")]
    public void DropdownAppearance_AttributeIsSet(DropdownAppearance value, string expectedAttribute)
    {
        var select = RenderNimbleSelect(value);

        Assert.Contains(expectedAttribute, select.Markup);
    }
    private IRenderedComponent<NimbleSelect> RenderNimbleSelect(DropdownAppearance appearance)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleSelect>(p => p.Add(x => x.Appearance, appearance));
    }

    private IRenderedComponent<NimbleSelect> RenderNimbleSelectWithOption()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleSelect>(p => p.AddChildContent<NimbleListOption>());
    }

    private IRenderedComponent<NimbleSelect> RenderNimbleSelect(Position position)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleSelect>(p => p.Add(x => x.Position, position));
    }
}
