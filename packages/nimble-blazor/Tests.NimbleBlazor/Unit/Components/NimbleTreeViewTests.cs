
using Bunit;
using NimbleBlazor.Components;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components
{
    /// <summary>
    /// Tests for <see cref="NimbleTreeView"/>
    /// </summary>
    public class NimbleTreeViewTests
    {
        [Fact]
        public void NimbleTreeView_Rendered_HasNimbleTreeViewMarkup()
        {
            var context = new TestContext();
            context.JSInterop.Mode = JSRuntimeMode.Loose;
            var expectedMarkup = "nimble-tree-view";

            var treeView = context.RenderComponent<NimbleTreeView>();

            Assert.Contains(expectedMarkup, treeView.Markup);
        }
    }
}
