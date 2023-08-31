using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleMappingIcon"/>
/// </summary>
public class NimbleMappingIconTests
{
    [Fact]
    public void NimbleMappingIcon_Rendered_HasMappingIconMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-mapping-icon";

        var element = context.RenderComponent<NimbleMappingIcon<int>>();

        Assert.Contains(expectedMarkup, element.Markup);
    }

    [Fact]
    public void NimbleMappingIconKeyAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, int>(x => x.Key, 1001);

        Assert.Contains($"key=\"1001\"", element.Markup);
    }

    [Fact]
    public void NimbleMappingIconTextAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, string>(x => x.Text, "foo");

        Assert.Contains($"text=\"foo\"", element.Markup);
    }

    [Fact]
    public void NimbleMappingIconIconAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, string>(x => x.Icon, "foo");

        Assert.Contains($"icon=\"foo\"", element.Markup);
    }

    [Fact]
    public void NimbleMappingIconSeverityAttribute_HasCorrectMarkup()
    {
        var element = RenderWithPropertySet<int, IconSeverity?>(x => x.Severity, IconSeverity.Success);

        Assert.Contains($"severity=\"success\"", element.Markup);
    }

    private IRenderedComponent<NimbleMappingIcon<TKey>> RenderWithPropertySet<TKey, TProperty>(Expression<Func<NimbleMappingIcon<TKey>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleMappingIcon<TKey>>(p => p.Add(propertyGetter, propertyValue));
    }
}
