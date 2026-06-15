using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleRadio"/>
/// </summary>
public class NimbleRadioTests : BunitTestBase
{
    [Fact]
    public void NimbleRadio_Rendered_HasRadioMarkup()
    {
        var radio = Render<NimbleRadio>();

        Assert.NotNull(radio.Find("nimble-radio"));
    }

    [Fact]
    public void NimbleRadio_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleRadio>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleRadioCurrentValue_AttributeIsSet()
    {
        var radio = RenderNimbleRadioWithPropertySet(x => x.CurrentValue, "foo");

        radio.AssertAttribute("current-value", "foo");
    }

    [Fact]
    public void NimbleRadioDisabled_AttributeIsSet()
    {
        var radio = RenderNimbleRadioWithPropertySet(x => x.Disabled, true);

        radio.AssertHasAttribute("disabled");
    }

    [Fact]
    public void NimbleRadioName_AttributeIsSet()
    {
        var radio = RenderNimbleRadioWithPropertySet(x => x.Name, "buttons");

        radio.AssertAttribute("name", "buttons");
    }

    private IRenderedComponent<NimbleRadio> RenderNimbleRadioWithPropertySet<TProperty>(Expression<Func<NimbleRadio, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleRadio>(p => p.Add(propertyGetter, propertyValue));
    }
}
