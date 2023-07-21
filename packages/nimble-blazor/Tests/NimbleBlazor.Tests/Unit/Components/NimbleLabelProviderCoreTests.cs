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
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-label-provider-core";

        var themeProvider = context.RenderComponent<NimbleLabelProviderCore>();

        Assert.Contains(expectedMarkup, themeProvider.Markup);
    }

    [Theory]
    [InlineData(nameof(NimbleLabelProviderCore.PopupDismiss))]
    [InlineData(nameof(NimbleLabelProviderCore.NumericDecrement))]
    [InlineData(nameof(NimbleLabelProviderCore.NumericIncrement))]
    public void NimbleLabelProviderCore_LabelIsSet(string propertyName)
    {
        var labelValue = propertyName + "UpdatedValue";
        var labelProvider = RenderNimbleLabelProvider(propertyName, labelValue);

        Assert.Contains(labelValue, labelProvider.Markup);
    }

    private IRenderedComponent<NimbleLabelProviderCore> RenderNimbleLabelProvider(string propertyName, string labelValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleLabelProviderCore>(ComponentParameter.CreateParameter(propertyName, labelValue));
    }
}
