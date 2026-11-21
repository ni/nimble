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

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task SelectedChange_UsesEventState(bool selected)
    {
        bool? callbackValue = null;
        var chip = Render<NimbleChip>(parameters => parameters
            .Add(x => x.Selected, selected)
            .Add(x => x.SelectedChanged, value => callbackValue = value));

        await chip.Find("nimble-chip").TriggerEventAsync(
            "onnimblechipselectedchange",
            new ChipSelectedChangeEventArgs { Selected = selected });

        Assert.Equal(selected, callbackValue);
        chip.AssertAttribute("selected", selected ? string.Empty : null);
    }

    private IRenderedComponent<NimbleChip> RenderWithPropertySet<TProperty>(Expression<Func<NimbleChip, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleChip>(p => p.Add(propertyGetter, propertyValue));
    }
}
