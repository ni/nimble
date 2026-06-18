using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

public class NimbleListOptionGroupTests : BunitTestBase
{
    [Fact]
    public void NimbleListOptionGroup_Rendered_HasListOptionGroupMarkup()
    {
        var group = Render<NimbleListOptionGroup>();

        Assert.NotNull(group.Find("nimble-list-option-group"));
    }

    [Fact]
    public void NimbleListOptionGroup_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleListOptionGroup>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleListOptionGroup_Hidden_AttributeIsSet()
    {
        var dialog = RenderWithPropertySet(x => x.Hidden, true);

        dialog.AssertHasAttribute("hidden");
    }

    [Fact]
    public void NimbleListOptionGroup_Hidden_AttributeIsNotSet()
    {
        var dialog = RenderWithPropertySet(x => x.Hidden, false);

        dialog.AssertAttribute("hidden", null);
    }

    [Fact]
    public void NimbleListOptionGroup_Label_AttributeIsSet()
    {
        var dialog = RenderWithPropertySet(x => x.Label, "foo");

        dialog.AssertAttribute("label", "foo");
    }

    private IRenderedComponent<NimbleListOptionGroup> RenderWithPropertySet<TProperty>(Expression<Func<NimbleListOptionGroup, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleListOptionGroup>(p => p.Add(propertyGetter, propertyValue));
    }
}
