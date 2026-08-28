using BlazorWorkspace.Testing.Unit;
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Xunit;

namespace OkBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="OkFvStickyHeader"/>.
/// </summary>
public class OkFvStickyHeaderTests : BunitTestBase
{
    [Fact]
    public void OkFvStickyHeader_Render_HasStickyHeaderMarkup()
    {
        var component = Render<OkFvStickyHeader>();

        Assert.NotNull(component.Find("ok-fv-sticky-header"));
    }

    [Fact]
    public void OkFvStickyHeader_Render_ProjectsNamedSlots()
    {
        void RenderHeader(RenderTreeBuilder builder)
        {
            builder.AddContent(0, "Primary header");
        }

        void RenderStickyHeader(RenderTreeBuilder builder)
        {
            builder.AddContent(0, "Sticky header");
        }

        var component = Render<OkFvStickyHeader>(parameters => parameters
            .Add(parameter => parameter.Header, RenderHeader)
            .Add(parameter => parameter.StickyHeader, RenderStickyHeader));

        var slottedElements = component.FindAll("[slot]");
        Assert.Collection(
            slottedElements,
            element =>
            {
                Assert.Equal("header", element.GetAttribute("slot"));
                Assert.Contains("Primary header", element.TextContent);
            },
            element =>
            {
                Assert.Equal("sticky-header", element.GetAttribute("slot"));
                Assert.Contains("Sticky header", element.TextContent);
            });
    }

    [Fact]
    public void OkFvStickyHeader_Render_DoesNotCreateEmptySlots()
    {
        var component = Render<OkFvStickyHeader>();

        Assert.Empty(component.FindAll("[slot]"));
    }

    [Fact]
    public void OkFvStickyHeader_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<OkFvStickyHeader>(parameters => parameters.AddUnmatched("class", "foo")));

        Assert.Null(exception);
    }
}
