using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleMappingText"/>
/// </summary>
public class NimbleMappingTextTests
{
    [Fact]
    public void NimbleMappingText_Rendered_HasMappingTextMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-mapping-text";

        var element = context.RenderComponent<NimbleMappingText<int>>();

        Assert.Contains(expectedMarkup, element.Markup);
    }

    [Fact]
    public void NimbleMappingTextKeyAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, int>(x => x.Key, 1001);

        Assert.Contains($"key=\"1001\"", element.Markup);
    }

    [Fact]
    public void NimbleMappingTextTextAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, string>(x => x.Text, "foo");

        Assert.Contains($"text=\"foo\"", element.Markup);
    }

    private IRenderedComponent<NimbleMappingText<TKey>> RenderWithPropertySet<TKey, TProperty>(Expression<Func<NimbleMappingText<TKey>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleMappingText<TKey>>(p => p.Add(propertyGetter, propertyValue));
    }
}
