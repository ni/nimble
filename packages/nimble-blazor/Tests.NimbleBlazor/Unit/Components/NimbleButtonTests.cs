
using Bunit;
using NimbleBlazor.Components;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components
{
    /// <summary>
    /// Tests for <see cref="NimbleButton"/>
    /// </summary>
    public class NimbleButtonTests
    {
        [Fact]
        public void NimbleButton_Render_HasButtonMarkup()
        {
            var context = new TestContext();
            context.JSInterop.Mode = JSRuntimeMode.Loose;
            var expectedMarkup = "nimble-button";

            var button = context.RenderComponent<NimbleButton>();

            Assert.Contains(expectedMarkup, button.Markup);
        }
    }
}
