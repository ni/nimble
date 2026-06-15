using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleMappingSpinner"/>
/// </summary>
public class NimbleMappingSpinnerTests : BunitTestBase
{
    [Fact]
    public void NimbleMappingSpinner_Rendered_HasMappingSpinnerMarkup()
    {
        var element = Render<NimbleMappingSpinner<int>>();

        Assert.NotNull(element.Find("nimble-mapping-spinner"));
    }

    [Fact]
    public void NimbleMappingSpinnerKeyAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, int>(x => x.Key, 1001);

        element.AssertAttribute("key", "1001");
    }

    [Fact]
    public void NimbleMappingSpinnerTextAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, string>(x => x.Text, "foo");

        element.AssertAttribute("text", "foo");
    }

    [Fact]
    public void NimbleMappingSpinnerTextHiddenAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, bool?>(x => x.TextHidden, true);

        element.AssertHasAttribute("text-hidden");
    }

    private IRenderedComponent<NimbleMappingSpinner<TKey>> RenderWithPropertySet<TKey, TProperty>(Expression<Func<NimbleMappingSpinner<TKey>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleMappingSpinner<TKey>>(p => p.Add(propertyGetter, propertyValue));
    }
}
