using Bunit;
using NimbleBlazor.Components;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleCheckbox"/>
/// </summary>
public class NimbleCheckboxTests
{
    [Fact]
    public void NimbleCheckbox_Rendered_HasCheckboxMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-checkbox";

        var checkbox = context.RenderComponent<NimbleCheckbox>();

        Assert.Contains(expectedMarkup, checkbox.Markup);
    }
}
