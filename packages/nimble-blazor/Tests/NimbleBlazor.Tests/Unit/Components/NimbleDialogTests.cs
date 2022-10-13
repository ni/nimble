using System;
using System.Linq.Expressions;
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

    [Fact]
    public void NimbleDialog_PreventDismiss_AttributeIsSet()
    {
        var dialog = RenderDialogWithPropertySet(x => x.PreventDismiss, true);

        Assert.Contains("prevent-dismiss", dialog.Markup);
    }

    [Fact]
    public void NimbleDialog_PreventDismiss_AttributeIsNotSet()
    {
        var dialog = RenderDialogWithPropertySet(x => x.PreventDismiss, false);

        Assert.DoesNotContain("prevent-dismiss", dialog.Markup);
    }

    [Fact]
    public void NimbleDialog_HeaderHidden_AttributeIsSet()
    {
        var dialog = RenderDialogWithPropertySet(x => x.HeaderHidden, true);

        Assert.Contains("header-hidden", dialog.Markup);
    }

    [Fact]
    public void NimbleDialog_HeaderHidden_AttributeIsNotSet()
    {
        var dialog = RenderDialogWithPropertySet(x => x.HeaderHidden, false);

        Assert.DoesNotContain("header-hidden", dialog.Markup);
    }

    [Fact]
    public void NimbleDialog_FooterHidden_AttributeIsSet()
    {
        var dialog = RenderDialogWithPropertySet(x => x.FooterHidden, true);

        Assert.Contains("footer-hidden", dialog.Markup);
    }

    [Fact]
    public void NimbleDialog_FooterHidden_AttributeIsNotSet()
    {
        var dialog = RenderDialogWithPropertySet(x => x.FooterHidden, false);

        Assert.DoesNotContain("footer-hidden", dialog.Markup);
    }

    private IRenderedComponent<NimbleDialog<string>> RenderDialogWithContent<TContent>()
        where TContent : IComponent
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleDialog<string>>(parameters => parameters.AddChildContent<TContent>());
    }

    private IRenderedComponent<NimbleDialog<string>> RenderDialogWithPropertySet<TProperty>(Expression<Func<NimbleDialog<string>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleDialog<string>>(parameters => parameters.Add(propertyGetter, propertyValue));
    }
}
