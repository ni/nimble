using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleMappingText"/>
/// </summary>
public class NimbleMappingTextTests : BunitTestBase
{
    [Fact]
    public void NimbleMappingText_Rendered_HasMappingTextMarkup()
    {
        var element = Render<NimbleMappingText<int>>();

        Assert.NotNull(element.Find("nimble-mapping-text"));
    }

    [Fact]
    public void NimbleMappingTextKeyAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, int>(x => x.Key, 1001);

        element.AssertAttribute("key", "1001");
    }

    [Fact]
    public void NimbleMappingTextTextAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, string?>(x => x.Text, "foo");

        element.AssertAttribute("text", "foo");
    }

    private IRenderedComponent<NimbleMappingText<TKey>> RenderWithPropertySet<TKey, TProperty>(Expression<Func<NimbleMappingText<TKey>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleMappingText<TKey>>(p => p.Add(propertyGetter, propertyValue));
    }
}
