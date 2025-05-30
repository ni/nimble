using System;
using System.Linq.Expressions;
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

    [Fact]
    public void NimbleSelect_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleSelect>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(Position.Below, "below")]
    [InlineData(Position.Above, "above")]
    public void SelectPosition_AttributeIsSet(Position value, string expectedAttribute)
    {
        var select = RenderWithPropertySet(x => x.Position, value);

        Assert.Contains(expectedAttribute, select.Markup);
    }

    [Fact]
    public void SelectErrorText_AttributeIsSet()
    {
        var select = RenderWithPropertySet(x => x.ErrorText, "bad number");

        Assert.Contains("error-text=\"bad number\"", select.Markup);
    }

    [Fact]
    public void SelectErrorVisible_AttributeIsSet()
    {
        var select = RenderWithPropertySet(x => x.ErrorVisible, true);

        Assert.Contains("error-visible", select.Markup);
    }

    [Fact]
    public void SelectRequiredVisible_AttributeIsSet()
    {
        var select = RenderWithPropertySet(x => x.RequiredVisible, true);

        Assert.Contains("required-visible", select.Markup);
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
    [InlineData(DropdownAppearance.Frameless, "frameless")]
    public void DropdownAppearance_AttributeIsSet(DropdownAppearance value, string expectedAttribute)
    {
        var select = RenderWithPropertySet(x => x.Appearance, value);

        Assert.Contains(expectedAttribute, select.Markup);
    }

    [Fact]
    public void Select_FilterModeStandardIsSet()
    {
        var expectedContents = "filter-mode=\"standard\"";
        var select = RenderWithPropertySet(x => x.FilterMode, FilterMode.Standard);

        Assert.Contains(expectedContents, select.Markup);
    }

    [Fact]
    public void Select_FilterModeNoneIsSet()
    {
        var select = RenderWithPropertySet(x => x.FilterMode, FilterMode.None);

        Assert.DoesNotContain("filter-mode", select.Markup);
    }

    [Fact]
    public void SelectClearable_AttributeIsSet()
    {
        var select = RenderWithPropertySet(x => x.Clearable, true);

        Assert.Contains("clearable", select.Markup);
    }

    [Fact]
    public void SelectAppearanceReadOnly_AttributeIsSet()
    {
        var select = RenderWithPropertySet(x => x.AppearanceReadOnly, true);

        Assert.Contains("appearance-readonly", select.Markup);
    }

    [Fact]
    public void SelectFullBleed_AttributeIsSet()
    {
        var select = RenderWithPropertySet(x => x.FullBleed, true);

        Assert.Contains("full-bleed", select.Markup);
    }

    private IRenderedComponent<NimbleSelect> RenderWithPropertySet<TProperty>(Expression<Func<NimbleSelect, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleSelect>(p => p.Add(propertyGetter, propertyValue));
    }

    private IRenderedComponent<NimbleSelect> RenderNimbleSelectWithOption()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleSelect>(p => p.AddChildContent<NimbleListOption>());
    }
}
