using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleMappingEmpty"/>
/// </summary>
public class NimbleMappingEmptyTests : BunitTestBase
{
    [Fact]
    public void NimbleMappingEmpty_Rendered_HasMappingTextMarkup()
    {
        var element = Render<NimbleMappingEmpty<int>>();

        Assert.NotNull(element.Find("nimble-mapping-empty"));
    }

    [Fact]
    public void NimbleMappingEmptyKeyAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, int>(x => x.Key, 1001);

        element.AssertAttribute("key", "1001");
    }

    [Fact]
    public void NimbleMappingEmptyTextAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, string?>(x => x.Text, "foo");

        element.AssertAttribute("text", "foo");
    }

    private IRenderedComponent<NimbleMappingEmpty<TKey>> RenderWithPropertySet<TKey, TProperty>(Expression<Func<NimbleMappingEmpty<TKey>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleMappingEmpty<TKey>>(p => p.Add(propertyGetter, propertyValue));
    }
}
