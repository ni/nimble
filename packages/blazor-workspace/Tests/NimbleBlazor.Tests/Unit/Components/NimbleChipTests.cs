using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleChip"/>.
/// </summary>
public class NimbleChipTests
{
    [Fact]
    public void NimbleChip_Render_HasChipMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-chip";

        var chip = context.RenderComponent<NimbleChip>();

        Assert.Contains(expectedMarkup, chip.Markup);
    }

    [Fact]
    public void NimbleChip_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleChip>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(ChipAppearance.Outline, "appearance=\"outline\"")]
    [InlineData(ChipAppearance.Block, "appearance=\"block\"")]
    public void ChipAppearance_AttributeIsSet(ChipAppearance value, string expectedMarkup)
    {
        var chip = RenderWithPropertySet(x => x.Appearance, value);

        Assert.Contains(expectedMarkup, chip.Markup);
    }

    private IRenderedComponent<NimbleChip> RenderWithPropertySet<TProperty>(Expression<Func<NimbleChip, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleChip>(p => p.Add(propertyGetter, propertyValue));
    }
}
