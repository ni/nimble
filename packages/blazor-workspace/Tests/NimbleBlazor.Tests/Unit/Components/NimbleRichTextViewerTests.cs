using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="NimbleRichTextViewer"/>
/// </summary>
public class NimbleRichTextViewerTests
{
    [Fact]
    public void NimbleRichTextViewer_Rendered_HasRichTextViewerMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "nimble-rich-text-viewer";

        var textField = context.RenderComponent<NimbleRichTextViewer>();

        Assert.Contains(expectedMarkup, textField.Markup);
    }

    [Fact]
    public void NimbleRichTextViewer_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<NimbleRichTextViewer>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void RichTextViewerMarkdown_AttributeIsSet()
    {
        var richTextViewer = RenderWithPropertySet(x => x.Markdown, "**markdown string**");

        Assert.Contains("markdown=\"**markdown string**\"", richTextViewer.Markup);
    }

    private IRenderedComponent<NimbleRichTextViewer> RenderWithPropertySet<TProperty>(Expression<Func<NimbleRichTextViewer, TProperty>> propertyGetter, TProperty propertyValue)
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        return context.RenderComponent<NimbleRichTextViewer>(p => p.Add(propertyGetter, propertyValue));
    }

}
