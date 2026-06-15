using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleLabelProviderCore"/>.
/// </summary>
public class NimbleLabelProviderCoreTests : BunitTestBase
{
    [Fact]
    public void NimbleLabelProviderCore_Render_HasLabelProviderMarkup()
    {
        var themeProvider = Render<NimbleLabelProviderCore>();

        Assert.NotNull(themeProvider.Find("nimble-label-provider-core"));
    }

    [Fact]
    public void NimbleLabelProviderCore_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleThemeProvider>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(nameof(NimbleLabelProviderCore.PopupDismiss))]
    [InlineData(nameof(NimbleLabelProviderCore.NumericDecrement))]
    [InlineData(nameof(NimbleLabelProviderCore.NumericIncrement))]
    [InlineData(nameof(NimbleLabelProviderCore.PopupIconError))]
    [InlineData(nameof(NimbleLabelProviderCore.PopupIconWarning))]
    [InlineData(nameof(NimbleLabelProviderCore.PopupIconCompleted))]
    [InlineData(nameof(NimbleLabelProviderCore.PopupIconCurrent))]
    [InlineData(nameof(NimbleLabelProviderCore.PopupIconInformation))]
    [InlineData(nameof(NimbleLabelProviderCore.FilterSearch))]
    [InlineData(nameof(NimbleLabelProviderCore.FilterNoResults))]
    [InlineData(nameof(NimbleLabelProviderCore.Loading))]
    [InlineData(nameof(NimbleLabelProviderCore.ScrollBackward))]
    [InlineData(nameof(NimbleLabelProviderCore.ScrollForward))]
    [InlineData(nameof(NimbleLabelProviderCore.ItemRemove))]
    public void NimbleLabelProviderCore_LabelIsSet(string propertyName)
    {
        var labelValue = propertyName + "UpdatedValue";
        var labelProvider = RenderNimbleLabelProvider(propertyName, labelValue);

        labelProvider.AssertAttribute(AttributeHelpers.ConvertToAttributeString(propertyName), labelValue);
    }

    private IRenderedComponent<NimbleLabelProviderCore> RenderNimbleLabelProvider(string propertyName, string labelValue)
    {
        return Render<NimbleLabelProviderCore>(parameters => parameters.AddUnmatched(AttributeHelpers.ConvertToAttributeString(propertyName), labelValue));
    }
}
