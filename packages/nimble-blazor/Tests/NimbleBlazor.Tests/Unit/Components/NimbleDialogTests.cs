using System.Threading.Tasks;
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

    enum DialogResult
    {
        OK
    }

    [Fact]
    public async Task NimbleDialog_ResultValueCanBeArbitraryType()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var rendered = context.RenderComponent<NimbleDialog<DialogResult>>();
        var task = rendered.Instance.ShowAsync();
        await rendered.Instance.CloseAsync(DialogResult.OK);
        var resultFromShow = await task;

        Assert.Equal(DialogCloseReason.Closed, resultFromShow.Reason);
        Assert.Equal(DialogResult.OK, resultFromShow.Value);
    }

    private IRenderedComponent<NimbleDialog<string>> RenderDialogWithContent<TContent>()
        where TContent : IComponent
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleDialog<string>>(parameters => parameters.AddChildContent<TContent>());
    }
}
