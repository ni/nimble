using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

public class NimbleListOptionGroupTests
{
    [Fact]
    public void NimbleListOptionGroup_Rendered_HasListOptionGroupMarkup()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-list-option-group";

        var group = context.Render<NimbleListOptionGroup>();

        Assert.Contains(expectedMarkup, group.Markup);
    }

    [Fact]
    public void NimbleListOptionGroup_SupportsAdditionalAttributes()
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.Render<NimbleListOptionGroup>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleListOptionGroup_Hidden_AttributeIsSet()
    {
        var dialog = RenderWithPropertySet(x => x.Hidden, true);

        Assert.Contains("hidden", dialog.Markup);
    }

    [Fact]
    public void NimbleListOptionGroup_Hidden_AttributeIsNotSet()
    {
        var dialog = RenderWithPropertySet(x => x.Hidden, false);

        Assert.DoesNotContain("hidden", dialog.Markup);
    }

    [Fact]
    public void NimbleListOptionGroup_Label_AttributeIsSet()
    {
        var dialog = RenderWithPropertySet(x => x.Label, "foo");

        Assert.Contains("label=\"foo\"", dialog.Markup);
    }

    private IRenderedComponent<NimbleListOptionGroup> RenderWithPropertySet<TProperty>(Expression<Func<NimbleListOptionGroup, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new BunitContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.Render<NimbleListOptionGroup>(p => p.Add(propertyGetter, propertyValue));
    }
}
