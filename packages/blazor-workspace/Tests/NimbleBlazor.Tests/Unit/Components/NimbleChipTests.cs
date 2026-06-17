using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleChip"/>.
/// </summary>
public class NimbleChipTests : BunitTestBase
{
    [Fact]
    public void NimbleChip_Render_HasChipMarkup()
    {
        var chip = Render<NimbleChip>();

        Assert.NotNull(chip.Find("nimble-chip"));
    }

    [Fact]
    public void NimbleChip_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleChip>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(ChipAppearance.Outline, "outline")]
    [InlineData(ChipAppearance.Block, "block")]
    public void ChipAppearance_AttributeIsSet(ChipAppearance value, string expectedAttribute)
    {
        var chip = RenderWithPropertySet(x => x.Appearance, value);

        chip.AssertAttribute("appearance", expectedAttribute);
    }

    private IRenderedComponent<NimbleChip> RenderWithPropertySet<TProperty>(Expression<Func<NimbleChip, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleChip>(p => p.Add(propertyGetter, propertyValue));
    }
}
