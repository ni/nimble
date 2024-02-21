using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleMappingSpinner"/>
/// </summary>
public class NimbleMappingSpinnerTests
{
    [Fact]
    public void NimbleMappingSpinner_Rendered_HasMappingSpinnerMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-mapping-spinner";

        var element = context.RenderComponent<NimbleMappingSpinner<int>>();

        Assert.Contains(expectedMarkup, element.Markup);
    }

    [Fact]
    public void NimbleMappingSpinnerKeyAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, int>(x => x.Key, 1001);

        Assert.Contains($"key=\"1001\"", element.Markup);
    }

    [Fact]
    public void NimbleMappingSpinnerTextAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, string>(x => x.Text, "foo");

        Assert.Contains($"text=\"foo\"", element.Markup);
    }

    private IRenderedComponent<NimbleMappingSpinner<TKey>> RenderWithPropertySet<TKey, TProperty>(Expression<Func<NimbleMappingSpinner<TKey>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleMappingSpinner<TKey>>(p => p.Add(propertyGetter, propertyValue));
    }
}
