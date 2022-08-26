using System;
using System.Linq.Expressions;
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
        var select = RenderNimbleComboboxWithPropertySet(x => x.Position, value);

        Assert.Contains(expectedAttribute, select.Markup);
    }

    [Theory]
    [InlineData(AutoComplete.Both, "both")]
    [InlineData(AutoComplete.List, "list")]
    [InlineData(AutoComplete.Inline, "inline")]
    [InlineData(AutoComplete.None, "none")]
    public void ComboboxAutoComplete_AttributeIsSet(AutoComplete value, string expectedAttribute)
    {
        var select = RenderNimbleComboboxWithPropertySet(x => x.AutoComplete, value);

        Assert.Contains(expectedAttribute, select.Markup);
    }

    [Theory]
    [InlineData(DropdownAppearance.Block, "block")]
    [InlineData(DropdownAppearance.Underline, "underline")]
    [InlineData(DropdownAppearance.Outline, "outline")]
    public void ComboboxAppearance_AttributeIsSet(DropdownAppearance value, string expectedAttribute)
    {
        var select = RenderNimbleComboboxWithPropertySet(x => x.Appearance, value);

        Assert.Contains(expectedAttribute, select.Markup);
    }

    [Fact]
    public void ComboboxPlaceholder_AttributeIsSet()
    {
        var placeholder = "Select value...";
        var select = RenderNimbleComboboxWithPropertySet(x => x.Placeholder, placeholder);

        Assert.Contains("placeholder", select.Markup);
    }

    [Fact]
    public void SelectWithOption_HasListOptionMarkup()
    {
        var expectedMarkup = "nimble-list-option";
        var select = RenderNimbleComboboxWithOption();

        Assert.Contains(expectedMarkup, select.Markup);
    }

    private IRenderedComponent<NimbleCombobox> RenderNimbleComboboxWithPropertySet<TProperty>(Expression<Func<NimbleCombobox, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleCombobox>(p => p.Add(propertyGetter, propertyValue));
    }

    private IRenderedComponent<NimbleCombobox> RenderNimbleComboboxWithOption()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleCombobox>(p => p.AddChildContent<NimbleListOption>());
    }
}
