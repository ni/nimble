using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleRadio"/>
/// </summary>
public class NimbleRadioTests
{
    [Fact]
    public void NimbleRadio_Rendered_HasRadioMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-radio";

        var radio = context.RenderComponent<NimbleRadio>();

        Assert.Contains(expectedMarkup, radio.Markup);
    }

    [Fact]
    public void NimbleRadioCurrentValue_AttributeIsSet()
    {
        var radio = RenderNimbleRadioWithPropertySet(x => x.CurrentValue, "foo");

        Assert.Contains("current-value", radio.Markup);
    }

    [Fact]
    public void NimbleRadioDisabled_AttributeIsSet()
    {
        var radio = RenderNimbleRadioWithPropertySet(x => x.Disabled, true);

        Assert.Contains("disabled", radio.Markup);
    }

    [Fact]
    public void NimbleRadioName_AttributeIsSet()
    {
        var radio = RenderNimbleRadioWithPropertySet(x => x.Name, "buttons");

        Assert.Contains("name", radio.Markup);
    }

    private IRenderedComponent<NimbleRadio> RenderNimbleRadioWithPropertySet<TProperty>(Expression<Func<NimbleRadio, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleRadio>(p => p.Add(propertyGetter, propertyValue));
    }
}
