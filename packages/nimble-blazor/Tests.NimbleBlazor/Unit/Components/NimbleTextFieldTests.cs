
using Bunit;
using NimbleBlazor.Components;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components
{
    /// <summary>
    /// Tests for <see cref="NimbleTextField"/>
    /// </summary>
    public class NimbleTextFieldTests
    {
        [Fact]
        public void NimbleTextField_Rendered_HasTextFieldMarkup()
        {
            var context = new TestContext();
            context.JSInterop.Mode = JSRuntimeMode.Loose;
            var expectedMarkup = "nimble-text-field";

            var textField = context.RenderComponent<NimbleTextField>();

            Assert.Contains(expectedMarkup, textField.Markup);
        }
    }
}
