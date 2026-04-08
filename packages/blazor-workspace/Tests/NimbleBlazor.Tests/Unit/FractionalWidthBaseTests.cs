using System;
using System.Linq.Expressions;
using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit;

public abstract class FractionalWidthBaseTests<T> where T : ComponentBase, IFractionalWidthColumn
{
    [Fact]
    public void NimbleTableColumn_WithFractionalWidthAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FractionalWidth!, 2);

        var expectedMarkup = @"fractional-width=""2""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumn_WithMinPixelWidthAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.MinPixelWidth!, 40);

        var expectedMarkup = @"min-pixel-width=""40""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnFractionalWidth_WithGermanCulture_FormatsValueWithPeriod()
    {
        using (new CultureScope("de-DE"))
        {
            var numberField = RenderWithPropertySet(x => x.FractionalWidth, 1.5);

            Assert.Contains("fractional-width=\"1.5\"", numberField.Markup);
        }
    }

    [Fact]
    public void NimbleTableColumnMinPixelWidth_WithGermanCulture_FormatsValueWithPeriod()
    {
        using (new CultureScope("de-DE"))
        {
            var numberField = RenderWithPropertySet(x => x.MinPixelWidth, 1.5);

            Assert.Contains("min-pixel-width=\"1.5\"", numberField.Markup);
        }
    }

    private IRenderedComponent<T> RenderWithPropertySet<TProperty>(Expression<Func<T, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<T>(p => p.Add(propertyGetter, propertyValue));
    }
}