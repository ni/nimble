using Bunit;
using Xunit;

namespace OkBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="OkFvAccordionItem"/>.
/// </summary>
public class OkFvAccordionItemTests
{
    [Fact]
    public void OkFvAccordionItem_Render_HasAccordionMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;

        var component = context.RenderComponent<OkFvAccordionItem>();

        Assert.Contains("ok-fv-accordion-item", component.Markup);
    }

    [Fact]
    public void OkFvAccordionItem_Render_MapsParametersToAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;

        var component = context.RenderComponent<OkFvAccordionItem>(parameters => parameters
            .Add(parameter => parameter.Header, "Accordion heading")
            .Add(parameter => parameter.Appearance, FvAccordionItemAppearance.Block)
            .Add(parameter => parameter.Expanded, true)
            .AddChildContent("Accordion body"));
        var element = component.Find("ok-fv-accordion-item");

        Assert.Equal("Accordion heading", element.GetAttribute("header"));
        Assert.Equal("block", element.GetAttribute("appearance"));
        Assert.True(element.HasAttribute("expanded"));
        Assert.Contains("Accordion body", component.Markup);
    }

    [Fact]
    public void OkFvAccordionItem_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;

        var exception = Record.Exception(() => context.RenderComponent<OkFvAccordionItem>(ComponentParameter.CreateParameter("class", "foo")));

        Assert.Null(exception);
    }
}
