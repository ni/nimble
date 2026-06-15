using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit;

public abstract class FractionalWidthBaseTests<T> : BunitTestBase where T : ComponentBase, IFractionalWidthColumn
{
    [Fact]
    public void NimbleTableColumn_WithFractionalWidthAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FractionalWidth!, 2);

        table.AssertAttribute("fractional-width", "2");
    }

    [Fact]
    public void NimbleTableColumn_WithMinPixelWidthAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.MinPixelWidth!, 40);

        table.AssertAttribute("min-pixel-width", "40");
    }

    [Fact]
    public void NimbleTableColumnFractionalWidth_WithGermanCulture_FormatsValueWithPeriod()
    {
        using (new CultureScope("de-DE"))
        {
            var numberField = RenderWithPropertySet(x => x.FractionalWidth, 1.5);

            numberField.AssertAttribute("fractional-width", "1.5");
        }
    }

    [Fact]
    public void NimbleTableColumnMinPixelWidth_WithGermanCulture_FormatsValueWithPeriod()
    {
        using (new CultureScope("de-DE"))
        {
            var numberField = RenderWithPropertySet(x => x.MinPixelWidth, 1.5);

            numberField.AssertAttribute("min-pixel-width", "1.5");
        }
    }

    private IRenderedComponent<T> RenderWithPropertySet<TProperty>(Expression<Func<T, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<T>(p => p.Add(propertyGetter, propertyValue));
    }
}