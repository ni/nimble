using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleMappingEmpty"/>
/// </summary>
public class NimbleMappingEmptyTests
{
    [Fact]
    public void NimbleMappingEmpty_Rendered_HasMappingTextMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-mapping-empty";

        var element = context.RenderComponent<NimbleMappingEmpty<int>>();

        Assert.Contains(expectedMarkup, element.Markup);
    }

    [Fact]
    public void NimbleMappingEmptyKeyAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, int>(x => x.Key, 1001);

        Assert.Contains($"key=\"1001\"", element.Markup);
    }

    [Fact]
    public void NimbleMappingEmptyTextAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, string>(x => x.Text, "foo");

        Assert.Contains($"text=\"foo\"", element.Markup);
    }

    private IRenderedComponent<NimbleMappingEmpty<TKey>> RenderWithPropertySet<TKey, TProperty>(Expression<Func<NimbleMappingEmpty<TKey>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleMappingEmpty<TKey>>(p => p.Add(propertyGetter, propertyValue));
    }
}
