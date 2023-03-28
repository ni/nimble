using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextTests
{
    [Fact]
    public void NimbleTableColumnText_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet<string>(x => x.FieldName!, "FirstName");

        var expectedMarkup = @"field-name=""FirstName""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnText_WithPlaceholderAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet<string>(x => x.Placeholder!, "No Value");

        var expectedMarkup = @"placeholder=""No Value""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnText_WithFractionalWidthAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet<double>(x => x.FractionalWidth!, 2);

        var expectedMarkup = @"fractional-width=""2""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnText_WithMinPixelWidthAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet<double?>(x => x.MinPixelWidth!, 40);

        var expectedMarkup = @"min-pixel-width=""40""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    private IRenderedComponent<NimbleTableColumnText> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnText, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnText>(p => p.Add(propertyGetter, propertyValue));
    }
}
