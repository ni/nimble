using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace OkBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="OkFvAccordionItem"/>.
/// </summary>
public class OkFvAccordionItemTests : BunitTestBase
{
    [Fact]
    public void OkFvAccordionItem_Render_HasAccordionMarkup()
    {
        var component = Render<OkFvAccordionItem>();

        Assert.NotNull(component.Find("ok-fv-accordion-item"));
    }

    [Fact]
    public void OkFvAccordionItem_Render_MapsParametersToAttributes()
    {
        var component = Render<OkFvAccordionItem>(parameters => parameters
            .Add(parameter => parameter.Header, "Accordion heading")
            .Add(parameter => parameter.Appearance, FvAccordionItemAppearance.Block)
            .Add(parameter => parameter.Expanded, true)
            .AddChildContent("Accordion body"));

        component.AssertAttribute("header", "Accordion heading");
        component.AssertAttribute("appearance", "block");
        component.AssertHasAttribute("expanded");
        Assert.Contains("Accordion body", component.RootElement().TextContent);
    }

    [Fact]
    public void OkFvAccordionItem_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<OkFvAccordionItem>(parameters => parameters.AddUnmatched("class", "foo")));

        Assert.Null(exception);
    }
}
