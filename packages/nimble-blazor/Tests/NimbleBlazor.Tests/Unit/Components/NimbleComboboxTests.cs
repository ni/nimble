using Bunit;
using NimbleBlazor;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleCombobox"/>
/// </summary>
public class NimbleComboboxTests
{
    [Fact]
    public void NimbleCombobox_Rendered_HasSelectMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-combobox";

        var select = context.RenderComponent<NimbleCombobox>();

        Assert.Contains(expectedMarkup, select.Markup);
    }

    [Theory]
    [InlineData(Position.Below, "below")]
    [InlineData(Position.Above, "above")]
    public void ComboboxPosition_AttributeIsSet(Position value, string expectedAttribute)
    {
        var select = RenderNimbleCombobox(value);

        Assert.Contains(expectedAttribute, select.Markup);
    }

    [Theory]
    [InlineData(AutoComplete.Both, "both")]
    [InlineData(AutoComplete.List, "list")]
    [InlineData(AutoComplete.Inline, "inline")]
    [InlineData(AutoComplete.None, "none")]
    public void ComboboxAutoComplete_AttributeIsSet(AutoComplete value, string expectedAttribute)
    {
        var select = RenderNimbleCombobox(value);

        Assert.Contains(expectedAttribute, select.Markup);
    }

    [Fact]
    public void SelectWithOption_HasListOptionMarkup()
    {
        var expectedMarkup = "nimble-list-option";
        var select = RenderNimbleComboboxWithOption();

        Assert.Contains(expectedMarkup, select.Markup);
    }

    private IRenderedComponent<NimbleCombobox> RenderNimbleCombobox(Position position)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleCombobox>(p => p.Add(x => x.Position, position));
    }

    private IRenderedComponent<NimbleCombobox> RenderNimbleCombobox(AutoComplete autoComplete)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleCombobox>(p => p.Add(x => x.AutoComplete, autoComplete));
    }

    private IRenderedComponent<NimbleCombobox> RenderNimbleComboboxWithOption()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleCombobox>(p => p.AddChildContent<NimbleListOption>());
    }
}
