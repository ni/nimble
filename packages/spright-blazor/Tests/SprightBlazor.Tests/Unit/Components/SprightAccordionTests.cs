using System;
using System.Linq.Expressions;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="SprightAccordion"/>.
/// </summary>
public class SprightAccordionTests
{
    [Fact]
    public void SprightAccordion_Render_HasCorrectMarkup()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var expectedMarkup = "spright-accordion";

        var component = context.RenderComponent<SprightAccordion>();

        Assert.Contains(expectedMarkup, component.Markup);
    }

    [Fact]
    public void SprightAccordion_SupportsAdditionalAttributes()
    {
        var context = new TestContext();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        var exception = Record.Exception(() => context.RenderComponent<SprightAccordion>(ComponentParameter.CreateParameter("class", "foo")));
        Assert.Null(exception);
    }
}
