using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleWaferMap"/>.
/// </summary>
public class NimbleWaferMapTests
{
    [Fact]
    public void NimbleWaferMap_WithGridMinXAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.GridMinX!, 3);

        var expectedMarkup = "grid-min-x=\"3\"";
        Assert.Contains(expectedMarkup, waferMap.Markup);
    }

    [Fact]
    public void NimbleWaferMap_WithGridMaxXAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.GridMaxX!, 3);

        var expectedMarkup = "grid-max-x=\"3\"";
        Assert.Contains(expectedMarkup, waferMap.Markup);
    }

    [Fact]
    public void NimbleWaferMap_WithGridMinYAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.GridMinY!, 3);

        var expectedMarkup = "grid-min-y=\"3\"";
        Assert.Contains(expectedMarkup, waferMap.Markup);
    }

    [Fact]
    public void NimbleWaferMap_WithGridMaxYAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.GridMaxY!, 3);

        var expectedMarkup = "grid-max-y=\"3\"";
        Assert.Contains(expectedMarkup, waferMap.Markup);
    }

    [Fact]
    public void NimbleWaferMap_WithDieLabelsHiddenAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.DieLabelsHidden!, true);

        var expectedMarkup = "die-labels-hidden";
        Assert.Contains(expectedMarkup, waferMap.Markup);
    }

    [Fact]
    public void NimbleWaferMap_WithDieLabelsSuffixAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.DieLabelsSuffix!, "a");

        var expectedMarkup = "die-labels-suffix=\"a\"";
        Assert.Contains(expectedMarkup, waferMap.Markup);
    }

    [Fact]
    public void NimbleWaferMap_WithMaxCharactersAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.MaxCharacters!, 3);

        var expectedMarkup = "max-characters=\"3\"";
        Assert.Contains(expectedMarkup, waferMap.Markup);
    }

    [Fact]
    public void NimbleWaferMap_WithColorScaleModeAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.ColorScaleMode!, WaferMapColorScaleMode.Ordinal);

        var expectedMarkup = "ordinal";
        Assert.Contains(expectedMarkup, waferMap.Markup);
    }

    [Theory]
    [InlineData(WaferMapOriginLocation.TopRight, "top-right")]
    [InlineData(WaferMapOriginLocation.TopLeft, "top-left")]
    [InlineData(WaferMapOriginLocation.BottomRight, "bottom-right")]
    public void NimbleWaferMap_WaferMapOriginLocation_AttributeIsSet(WaferMapOriginLocation value, string expectedAttribute)
    {
        var waferMap = RenderWithPropertySet(x => x.OriginLocation!, value);

        Assert.Contains(expectedAttribute, waferMap.Markup);
    }

    [Theory]
    [InlineData(WaferMapOrientation.Bottom, "bottom")]
    [InlineData(WaferMapOrientation.Left, "left")]
    [InlineData(WaferMapOrientation.Right, "right")]
    public void NimbleWaferMap_WaferMapOrientation_AttributeIsSet(WaferMapOrientation value, string expectedAttribute)
    {
        var waferMap = RenderWithPropertySet(x => x.Orientation!, value);

        Assert.Contains(expectedAttribute, waferMap.Markup);
    }

    private IRenderedComponent<NimbleWaferMap> RenderWithPropertySet<TProperty>(Expression<Func<NimbleWaferMap, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleWaferMap>(p => p.Add(propertyGetter, propertyValue));
    }
}
