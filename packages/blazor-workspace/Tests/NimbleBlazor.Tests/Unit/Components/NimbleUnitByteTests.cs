using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleUnitByte"/>
/// </summary>
public class NimbleUnitByteTests
{
    [Fact]
    public void NimbleUnitByte_Rendered_HasUnitByteMarkup()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-unit-byte";

        var element = context.Render<NimbleUnitByte>();

        Assert.Contains(expectedMarkup, element.Markup);
    }

    [Fact]
    public void NimbleUnitByte_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<NimbleUnitByte>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleUnitByteBinaryAttribute_HasMarkup()
    {
        var element = RenderWithPropertySet(x => x.Binary, true);

        Assert.Contains("binary", element.Markup);
    }

    private IRenderedComponent<NimbleUnitByte> RenderWithPropertySet<TProperty>(Expression<Func<NimbleUnitByte, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.Render<NimbleUnitByte>(p => p.Add(propertyGetter, propertyValue));
    }
}
