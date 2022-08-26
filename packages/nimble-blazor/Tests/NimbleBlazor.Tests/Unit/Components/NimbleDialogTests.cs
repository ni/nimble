using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleDialog"/>
/// </summary>
public class NimbleDialogTests
{
    [Fact]
    public void NimbleDialog_Rendered_HasDialogMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-dialog";
        var dialog = context.RenderComponent<NimbleDialog<string>>();

        Assert.Contains(expectedMarkup, dialog.Markup);
    }

    [Fact]
    public void NimbleDialog_WithChildContent_HasChildMarkup()
    {
        var dialog = RenderDialogWithContent<NimbleButton>();
        var expectedMarkup = "nimble-button";

        Assert.Contains(expectedMarkup, dialog.Markup);
    }

    private IRenderedComponent<NimbleDialog<string>> RenderDialogWithContent<TContent>()
        where TContent : IComponent
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleDialog<string>>(parameters => parameters.AddChildContent<TContent>());
    }
}
