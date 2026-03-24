using System;
using System.Linq.Expressions;
using Bunit;
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

    [Fact]
    public void NimbleCheckbox_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleCheckbox>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleCheckboxErrorText_AttributeIsSet()
    {
        var checkbox = RenderNimbleCheckboxWithPropertySet(x => x.ErrorText, "bad value");

        Assert.Contains("error-text=\"bad value\"", checkbox.Markup);
    }

    [Fact]
    public void NimbleCheckboxErrorVisible_AttributeIsSet()
    {
        var checkbox = RenderNimbleCheckboxWithPropertySet(x => x.ErrorVisible, true);

        Assert.Contains("error-visible", checkbox.Markup);
    }

    private IRenderedComponent<NimbleCheckbox> RenderNimbleCheckboxWithPropertySet<TProperty>(Expression<Func<NimbleCheckbox, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleCheckbox>(p => p.Add(propertyGetter, propertyValue));
    }
}
