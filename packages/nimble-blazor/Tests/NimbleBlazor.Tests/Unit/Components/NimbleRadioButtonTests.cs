using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleRadioButton"/>
/// </summary>
public class NimbleRadioButtonTests
{
    [Fact]
    public void NimbleRadioButton_Rendered_HasRadioButtonMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-radio-button";

        var radioButton = context.RenderComponent<NimbleRadioButton>();

        Assert.Contains(expectedMarkup, radioButton.Markup);
    }
}
