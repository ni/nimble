using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;
#nullable enable
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextTests
{
    [Fact]
    public void NimbleTableColumnText_WithFieldNameAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.FieldName!, "FirstName");

        var expectedMarkup = @"field-name=""FirstName""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    [Fact]
    public void NimbleTableColumnText_WithPlaceholderAttribute_HasTableMarkup()
    {
        var table = RenderWithPropertySet(x => x.Placeholder!, "No Value");

        var expectedMarkup = @"placeholder=""No Value""";
        Assert.Contains(expectedMarkup, table.Markup);
    }

    private IRenderedComponent<NimbleTableColumnText> RenderWithPropertySet<TProperty>(Expression<Func<NimbleTableColumnText, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleTableColumnText>(p => p.Add(propertyGetter, propertyValue));
    }
}
