using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleUnitByte"/>
/// </summary>
public class NimbleUnitByteTests : BunitTestBase
{
    [Fact]
    public void NimbleUnitByte_Rendered_HasUnitByteMarkup()
    {
        var element = Render<NimbleUnitByte>();

        Assert.NotNull(element.Find("nimble-unit-byte"));
    }

    [Fact]
    public void NimbleUnitByte_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleUnitByte>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleUnitByteBinaryAttribute_HasMarkup()
    {
        var element = RenderWithPropertySet(x => x.Binary, true);

        element.AssertHasAttribute("binary");
    }

    private IRenderedComponent<NimbleUnitByte> RenderWithPropertySet<TProperty>(Expression<Func<NimbleUnitByte, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleUnitByte>(p => p.Add(propertyGetter, propertyValue));
    }
}
