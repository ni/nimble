using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleLabelProviderCore"/>.
/// </summary>
public class NimbleLabelProviderCoreTests
{
    [Fact]
    public void NimbleLabelProviderCore_Render_HasLabelProviderMarkup()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-label-provider-core";

        var themeProvider = context.Render<NimbleLabelProviderCore>();

        Assert.Contains(expectedMarkup, themeProvider.Markup);
    }

    [Fact]
    public void NimbleLabelProviderCore_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<NimbleThemeProvider>(parameters => parameters.AddUnmatched("class", "foo")));
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

        Assert.Contains(labelValue, labelProvider.Markup);
    }

    private IRenderedComponent<NimbleLabelProviderCore> RenderNimbleLabelProvider(string propertyName, string labelValue)
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.Render<NimbleLabelProviderCore>(parameters => parameters.AddUnmatched(propertyName, labelValue));
    }
}
