using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleMappingIcon"/>
/// </summary>
public class NimbleMappingIconTests : BunitTestBase
{
    [Fact]
    public void NimbleMappingIcon_Rendered_HasMappingIconMarkup()
    {
        var element = Render<NimbleMappingIcon<int>>();

        Assert.NotNull(element.Find("nimble-mapping-icon"));
    }

    [Fact]
    public void NimbleMappingIconKeyAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, int>(x => x.Key, 1001);

        element.AssertAttribute("key", "1001");
    }

    [Fact]
    public void NimbleMappingIconTextAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, string>(x => x.Text, "foo");

        element.AssertAttribute("text", "foo");
    }

    [Fact]
    public void NimbleMappingIconIconAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, string>(x => x.Icon, "foo");

        element.AssertAttribute("icon", "foo");
    }

    [Fact]
    public void NimbleMappingIconSeverityAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, IconSeverity?>(x => x.Severity, IconSeverity.Success);

        element.AssertAttribute("severity", "success");
    }

    [Fact]
    public void NimbleMappingIconTextHiddenAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, bool?>(x => x.TextHidden, true);

        element.AssertHasAttribute("text-hidden");
    }

    private IRenderedComponent<NimbleMappingIcon<TKey>> RenderWithPropertySet<TKey, TProperty>(Expression<Func<NimbleMappingIcon<TKey>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleMappingIcon<TKey>>(p => p.Add(propertyGetter, propertyValue));
    }
}
