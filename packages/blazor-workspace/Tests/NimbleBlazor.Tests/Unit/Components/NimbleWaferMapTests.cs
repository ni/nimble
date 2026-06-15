using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleWaferMap"/>.
/// </summary>
public class NimbleWaferMapTests : BunitTestBase
{
    [Fact]
    public void NimbleWaferMap_WithGridMinXAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.GridMinX!, 3);

        waferMap.AssertAttribute("grid-min-x", "3");
    }

    [Fact]
    public void NimbleWaferMap_WithGridMaxXAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.GridMaxX!, 3);

        waferMap.AssertAttribute("grid-max-x", "3");
    }

    [Fact]
    public void NimbleWaferMap_WithGridMinYAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.GridMinY!, 3);

        waferMap.AssertAttribute("grid-min-y", "3");
    }

    [Fact]
    public void NimbleWaferMap_WithGridMaxYAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.GridMaxY!, 3);

        waferMap.AssertAttribute("grid-max-y", "3");
    }

    [Fact]
    public void NimbleWaferMap_WithDieLabelsHiddenAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.DieLabelsHidden!, true);

        waferMap.AssertHasAttribute("die-labels-hidden");
    }

    [Fact]
    public void NimbleWaferMap_WithDieLabelsSuffixAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.DieLabelsSuffix!, "a");

        waferMap.AssertAttribute("die-labels-suffix", "a");
    }

    [Fact]
    public void NimbleWaferMap_WithMaxCharactersAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.MaxCharacters!, 3);

        waferMap.AssertAttribute("max-characters", "3");
    }

    [Fact]
    public void NimbleWaferMap_WithColorScaleModeAttribute_HasMarkup()
    {
        var waferMap = RenderWithPropertySet(x => x.ColorScaleMode!, WaferMapColorScaleMode.Ordinal);

        waferMap.AssertAttribute("color-scale-mode", "ordinal");
    }

    [Fact]
    public void NimbleWaferMapGridMinX_WithGermanCulture_FormatsValueWithPeriod()
    {
        using (new CultureScope("de-DE"))
        {
            var numberField = RenderWithPropertySet(x => x.GridMinX, 1.5);

            numberField.AssertAttribute("grid-min-x", "1.5");
        }
    }

    [Fact]
    public void NimbleWaferMapGridMaxX_WithGermanCulture_FormatsValueWithPeriod()
    {
        using (new CultureScope("de-DE"))
        {
            var numberField = RenderWithPropertySet(x => x.GridMaxX, 1.5);

            numberField.AssertAttribute("grid-max-x", "1.5");
        }
    }

    [Fact]
    public void NimbleWaferMapGridMinY_WithGermanCulture_FormatsValueWithPeriod()
    {
        using (new CultureScope("de-DE"))
        {
            var numberField = RenderWithPropertySet(x => x.GridMinY, 1.5);

            numberField.AssertAttribute("grid-min-y", "1.5");
        }
    }

    [Fact]
    public void NimbleWaferMapGridMaxY_WithGermanCulture_FormatsValueWithPeriod()
    {
        using (new CultureScope("de-DE"))
        {
            var numberField = RenderWithPropertySet(x => x.GridMaxY, 1.5);

            numberField.AssertAttribute("grid-max-y", "1.5");
        }
    }

    [Fact]
    public void NimbleWaferMapMaxCharacters_WithGermanCulture_FormatsValueWithPeriod()
    {
        using (new CultureScope("de-DE"))
        {
            var numberField = RenderWithPropertySet(x => x.MaxCharacters, 1.5);

            numberField.AssertAttribute("max-characters", "1.5");
        }
    }

    [Theory]
    [InlineData(WaferMapOriginLocation.TopRight, "top-right")]
    [InlineData(WaferMapOriginLocation.TopLeft, "top-left")]
    [InlineData(WaferMapOriginLocation.BottomRight, "bottom-right")]
    public void NimbleWaferMap_WaferMapOriginLocation_AttributeIsSet(WaferMapOriginLocation value, string expectedAttribute)
    {
        var waferMap = RenderWithPropertySet(x => x.OriginLocation!, value);

        waferMap.AssertAttribute("origin-location", expectedAttribute);
    }

    [Theory]
    [InlineData(WaferMapOrientation.Bottom, "bottom")]
    [InlineData(WaferMapOrientation.Left, "left")]
    [InlineData(WaferMapOrientation.Right, "right")]
    public void NimbleWaferMap_WaferMapOrientation_AttributeIsSet(WaferMapOrientation value, string expectedAttribute)
    {
        var waferMap = RenderWithPropertySet(x => x.Orientation!, value);

        waferMap.AssertAttribute("orientation", expectedAttribute);
    }

    private IRenderedComponent<NimbleWaferMap> RenderWithPropertySet<TProperty>(Expression<Func<NimbleWaferMap, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleWaferMap>(p => p.Add(propertyGetter, propertyValue));
    }
}
