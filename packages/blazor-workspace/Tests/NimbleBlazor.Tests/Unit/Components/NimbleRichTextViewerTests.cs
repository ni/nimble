using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Test for <see cref="NimbleRichTextViewer"/>
/// </summary>
public class NimbleRichTextViewerTests : BunitTestBase
{
    [Fact]
    public void NimbleRichTextViewer_Rendered_HasRichTextViewerMarkup()
    {
        var textField = Render<NimbleRichTextViewer>();

        Assert.NotNull(textField.Find("nimble-rich-text-viewer"));
    }

    [Fact]
    public void NimbleRichTextViewer_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleRichTextViewer>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void RichTextViewerMarkdown_AttributeIsSet()
    {
        var richTextViewer = RenderWithPropertySet(x => x.Markdown, "**markdown string**");

        richTextViewer.AssertAttribute("markdown", "**markdown string**");
    }

    private IRenderedComponent<NimbleRichTextViewer> RenderWithPropertySet<TProperty>(Expression<Func<NimbleRichTextViewer, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleRichTextViewer>(p => p.Add(propertyGetter, propertyValue));
    }
}
