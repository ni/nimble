using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleCombobox"/>
/// </summary>
public class NimbleComboboxTests : BunitTestBase
{
    [Fact]
    public void NimbleCombobox_Rendered_HasComboboxMarkup()
    {
        var combobox = Render<NimbleCombobox>();

        Assert.NotNull(combobox.Find("nimble-combobox"));
    }

    [Fact]
    public void NimbleCombobox_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleCombobox>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(Position.Below, "below")]
    [InlineData(Position.Above, "above")]
    public void ComboboxPosition_AttributeIsSet(Position value, string expectedAttribute)
    {
        var combobox = RenderWithPropertySet(x => x.Position, value);

        combobox.AssertAttribute("position", expectedAttribute);
    }

    [Theory]
    [InlineData(AutoComplete.Both, "both")]
    [InlineData(AutoComplete.List, "list")]
    [InlineData(AutoComplete.Inline, "inline")]
    [InlineData(AutoComplete.None, "none")]
    public void ComboboxAutoComplete_AttributeIsSet(AutoComplete value, string expectedAttribute)
    {
        var combobox = RenderWithPropertySet(x => x.AutoComplete, value);

        combobox.AssertAttribute("autocomplete", expectedAttribute);
    }

    [Theory]
    [InlineData(DropdownAppearance.Block, "block")]
    [InlineData(DropdownAppearance.Underline, "underline")]
    [InlineData(DropdownAppearance.Outline, "outline")]
    [InlineData(DropdownAppearance.Frameless, "frameless")]
    public void ComboboxAppearance_AttributeIsSet(DropdownAppearance value, string expectedAttribute)
    {
        var combobox = RenderWithPropertySet(x => x.Appearance, value);

        combobox.AssertAttribute("appearance", expectedAttribute);
    }

    [Fact]
    public void ComboboxPlaceholder_AttributeIsSet()
    {
        var placeholder = "Combobox value...";
        var combobox = RenderWithPropertySet(x => x.Placeholder, placeholder);

        combobox.AssertAttribute("placeholder", placeholder);
    }

    [Fact]
    public void ComboboxErrorText_AttributeIsSet()
    {
        var combobox = RenderWithPropertySet(x => x.ErrorText, "bad number");

        combobox.AssertAttribute("error-text", "bad number");
    }

    [Fact]
    public void ComboboxErrorVisible_AttributeIsSet()
    {
        var combobox = RenderWithPropertySet(x => x.ErrorVisible, true);

        combobox.AssertHasAttribute("error-visible");
    }

    [Fact]
    public void ComboboxRequiredVisible_AttributeIsSet()
    {
        var combobox = RenderWithPropertySet(x => x.RequiredVisible, true);

        combobox.AssertHasAttribute("required-visible");
    }

    [Fact]
    public void ComboboxAppearanceReadOnly_AttributeIsSet()
    {
        var combobox = RenderWithPropertySet(x => x.AppearanceReadOnly, true);

        combobox.AssertHasAttribute("appearance-readonly");
    }

    [Fact]
    public void ComboboxFullBleed_AttributeIsSet()
    {
        var combobox = RenderWithPropertySet(x => x.FullBleed, true);

        combobox.AssertHasAttribute("full-bleed");
    }

    [Fact]
    public void ComboboxWithOption_HasListOptionMarkup()
    {
        var combobox = RenderNimbleComboboxWithOption();

        Assert.NotNull(combobox.Find("nimble-list-option"));
    }

    private IRenderedComponent<NimbleCombobox> RenderWithPropertySet<TProperty>(Expression<Func<NimbleCombobox, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleCombobox>(p => p.Add(propertyGetter, propertyValue));
    }

    private IRenderedComponent<NimbleCombobox> RenderNimbleComboboxWithOption()
    {
        return Render<NimbleCombobox>(p => p.AddChildContent<NimbleListOption>());
    }
}
