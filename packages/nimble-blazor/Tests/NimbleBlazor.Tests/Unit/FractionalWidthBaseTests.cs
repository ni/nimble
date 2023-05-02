using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;
using Microsoft.AspNetCore.Components;
#nullable enable
namespace NimbleBlazor.Tests.Unit;

public abstract class FractionalWidthBaseTests<T> where T : ComponentBase, FractionalWidthColumn
{
    protected void NimbleTableColumn_WithFractionalWidthAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FractionalWidth!, 2);

        var expectedMarkup = @"fractional-width=""2""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    protected void NimbleTableColumn_WithMinPixelWidthAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.MinPixelWidth!, 40);

        var expectedMarkup = @"min-pixel-width=""40""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    private IRenderedComponent<T> RenderWithPropertySet<TProperty>(Expression<Func<T, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<T>(p => p.Add(propertyGetter, propertyValue));
    }
}