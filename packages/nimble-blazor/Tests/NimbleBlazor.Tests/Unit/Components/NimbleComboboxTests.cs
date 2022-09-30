using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleCombobox"/>
/// </summary>
public class NimbleComboboxTests
{
    [Fact]
    public void NimbleCombobox_Rendered_HasComboboxMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-combobox";

        var combobox = context.RenderComponent<NimbleCombobox>();

        Assert.Contains(expectedMarkup, combobox.Markup);
    }

    [Theory]
    [InlineData(Position.Below, "below")]
    [InlineData(Position.Above, "above")]
    public void ComboboxPosition_AttributeIsSet(Position value, string expectedAttribute)
    {
        var combobox = RenderWithPropertySet(x => x.Position, value);

        Assert.Contains(expectedAttribute, combobox.Markup);
    }

    [Theory]
    [InlineData(AutoComplete.Both, "both")]
    [InlineData(AutoComplete.List, "list")]
    [InlineData(AutoComplete.Inline, "inline")]
    [InlineData(AutoComplete.None, "none")]
    public void ComboboxAutoComplete_AttributeIsSet(AutoComplete value, string expectedAttribute)
    {
        var combobox = RenderWithPropertySet(x => x.AutoComplete, value);

        Assert.Contains(expectedAttribute, combobox.Markup);
    }

    [Theory]
    [InlineData(DropdownAppearance.Block, "block")]
    [InlineData(DropdownAppearance.Underline, "underline")]
    [InlineData(DropdownAppearance.Outline, "outline")]
    public void ComboboxAppearance_AttributeIsSet(DropdownAppearance value, string expectedAttribute)
    {
        var combobox = RenderWithPropertySet(x => x.Appearance, value);

        Assert.Contains(expectedAttribute, combobox.Markup);
    }

    [Fact]
    public void ComboboxPlaceholder_AttributeIsSet()
    {
        var placeholder = "Combobox value...";
        var combobox = RenderWithPropertySet(x => x.Placeholder, placeholder);

        Assert.Contains("placeholder", combobox.Markup);
    }

    [Fact]
    public void ComboboxErrorText_AttributeIsSet()
    {
        var combobox = RenderWithPropertySet(x => x.ErrorText, "bad number");

        Assert.Contains("error-text=\"bad number\"", combobox.Markup);
    }

    [Fact]
    public void ComboboxErrorVisible_AttributeIsSet()
    {
        var combobox = RenderWithPropertySet(x => x.ErrorVisible, true);

        Assert.Contains("error-visible", combobox.Markup);
    }

    [Fact]
    public void ComboboxWithOption_HasListOptionMarkup()
    {
        var expectedMarkup = "nimble-list-option";
        var combobox = RenderNimbleComboboxWithOption();

        Assert.Contains(expectedMarkup, combobox.Markup);
    }

    private IRenderedComponent<NimbleCombobox> RenderWithPropertySet<TProperty>(Expression<Func<NimbleCombobox, TProperty>> propertyGetter, TProperty propertyValue)
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
