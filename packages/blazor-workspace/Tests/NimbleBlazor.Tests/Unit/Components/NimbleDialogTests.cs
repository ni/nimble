using System;
using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Microsoft.AspNetCore.Components;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleDialog"/>
/// </summary>
public class NimbleDialogTests : BunitTestBase
{
    [Fact]
    public void NimbleDialog_Rendered_HasDialogMarkup()
    {
        var dialog = Render<NimbleDialog<string>>();

        Assert.NotNull(dialog.Find("nimble-dialog"));
    }

    [Fact]
    public void NimbleDialog_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleDialog<string>>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleDialog_WithChildContent_HasChildMarkup()
    {
        var dialog = RenderDialogWithContent<NimbleButton>();

        Assert.NotNull(dialog.Find("nimble-button"));
    }

    [Fact]
    public void NimbleDialog_PreventDismiss_AttributeIsSet()
    {
        var dialog = RenderDialogWithPropertySet(x => x.PreventDismiss, true);

        dialog.AssertHasAttribute("prevent-dismiss");
    }

    [Fact]
    public void NimbleDialog_PreventDismiss_AttributeIsNotSet()
    {
        var dialog = RenderDialogWithPropertySet(x => x.PreventDismiss, false);

        dialog.AssertAttribute("prevent-dismiss", null);
    }

    [Fact]
    public void NimbleDialog_HeaderHidden_AttributeIsSet()
    {
        var dialog = RenderDialogWithPropertySet(x => x.HeaderHidden, true);

        dialog.AssertHasAttribute("header-hidden");
    }

    [Fact]
    public void NimbleDialog_HeaderHidden_AttributeIsNotSet()
    {
        var dialog = RenderDialogWithPropertySet(x => x.HeaderHidden, false);

        dialog.AssertAttribute("header-hidden", null);
    }

    [Fact]
    public void NimbleDialog_FooterHidden_AttributeIsSet()
    {
        var dialog = RenderDialogWithPropertySet(x => x.FooterHidden, true);

        dialog.AssertHasAttribute("footer-hidden");
    }

    [Fact]
    public void NimbleDialog_FooterHidden_AttributeIsNotSet()
    {
        var dialog = RenderDialogWithPropertySet(x => x.FooterHidden, false);

        dialog.AssertAttribute("footer-hidden", null);
    }

    private IRenderedComponent<NimbleDialog<string>> RenderDialogWithContent<TContent>()
        where TContent : IComponent
    {
        return Render<NimbleDialog<string>>(parameters => parameters.AddChildContent<TContent>());
    }

    private IRenderedComponent<NimbleDialog<string>> RenderDialogWithPropertySet<TProperty>(Expression<Func<NimbleDialog<string>, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleDialog<string>>(parameters => parameters.Add(propertyGetter, propertyValue));
    }
}
