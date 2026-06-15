using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleSelect"/>
/// </summary>
public class NimbleSelectTests : BunitTestBase
{
    [Fact]
    public void NimbleSelect_Rendered_HasSelectMarkup()
    {
        var select = Render<NimbleSelect>();

        Assert.NotNull(select.Find("nimble-select"));
    }

    [Fact]
    public void NimbleSelect_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleSelect>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(Position.Below, "below")]
    [InlineData(Position.Above, "above")]
    public void SelectPosition_AttributeIsSet(Position value, string expectedAttribute)
    {
        var select = RenderWithPropertySet(x => x.Position, value);

        select.AssertAttribute("position", expectedAttribute);
    }

    [Fact]
    public void SelectErrorText_AttributeIsSet()
    {
        var select = RenderWithPropertySet(x => x.ErrorText, "bad number");

        select.AssertAttribute("error-text", "bad number");
    }

    [Fact]
    public void SelectErrorVisible_AttributeIsSet()
    {
        var select = RenderWithPropertySet(x => x.ErrorVisible, true);

        select.AssertHasAttribute("error-visible");
    }

    [Fact]
    public void SelectRequiredVisible_AttributeIsSet()
    {
        var select = RenderWithPropertySet(x => x.RequiredVisible, true);

        select.AssertHasAttribute("required-visible");
    }

    [Fact]
    public void SelectWithOption_HasListOptionMarkup()
    {
        var select = RenderNimbleSelectWithOption();

        Assert.NotNull(select.Find("nimble-list-option"));
    }

    [Theory]
    [InlineData(DropdownAppearance.Outline, "outline")]
    [InlineData(DropdownAppearance.Block, "block")]
    [InlineData(DropdownAppearance.Underline, "underline")]
    [InlineData(DropdownAppearance.Frameless, "frameless")]
    public void DropdownAppearance_AttributeIsSet(DropdownAppearance value, string expectedAttribute)
    {
        var select = RenderWithPropertySet(x => x.Appearance, value);

        select.AssertAttribute("appearance", expectedAttribute);
    }

    [Fact]
    public void Select_FilterModeStandardIsSet()
    {
        var select = RenderWithPropertySet(x => x.FilterMode, FilterMode.Standard);

        select.AssertAttribute("filter-mode", "standard");
    }

    [Fact]
    public void Select_FilterModeNoneIsSet()
    {
        var select = RenderWithPropertySet(x => x.FilterMode, FilterMode.None);

        select.AssertAttribute("filter-mode", null);
    }

    [Fact]
    public void SelectClearable_AttributeIsSet()
    {
        var select = RenderWithPropertySet(x => x.Clearable, true);

        select.AssertHasAttribute("clearable");
    }

    [Fact]
    public void SelectAppearanceReadOnly_AttributeIsSet()
    {
        var select = RenderWithPropertySet(x => x.AppearanceReadOnly, true);

        select.AssertHasAttribute("appearance-readonly");
    }

    [Fact]
    public void SelectFullBleed_AttributeIsSet()
    {
        var select = RenderWithPropertySet(x => x.FullBleed, true);

        select.AssertHasAttribute("full-bleed");
    }

    private IRenderedComponent<NimbleSelect> RenderWithPropertySet<TProperty>(Expression<Func<NimbleSelect, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleSelect>(p => p.Add(propertyGetter, propertyValue));
    }

    private IRenderedComponent<NimbleSelect> RenderNimbleSelectWithOption()
    {
        return Render<NimbleSelect>(p => p.AddChildContent<NimbleListOption>());
    }
}
