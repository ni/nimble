﻿
using Bunit;
using NimbleBlazor.Components;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components
{
    /// <summary>
    /// Tests for <see cref="NimbleMenu"/>
    /// </summary>
    public class NimbleMenuTests
    {
        [Fact]
        public void NimbleMenu_Rendered_HasMenuMarkup()
        {
            var context = new TestContext();
            context.JSInterop.Mode = JSRuntimeMode.Loose;
            var expectedMarkup = "nimble-menu";

            var menu = context.RenderComponent<NimbleMenu>();

            Assert.Contains(expectedMarkup, menu.Markup);
        }
    }
}
