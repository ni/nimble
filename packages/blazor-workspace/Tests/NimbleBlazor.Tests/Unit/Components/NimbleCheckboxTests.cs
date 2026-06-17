using System.Linq.Expressions;
using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="NimbleCheckbox"/>
/// </summary>
public class NimbleCheckboxTests : BunitTestBase
{
    [Fact]
    public void NimbleCheckbox_Rendered_HasCheckboxMarkup()
    {
        var checkbox = Render<NimbleCheckbox>();

        Assert.NotNull(checkbox.Find("nimble-checkbox"));
    }

    [Fact]
    public void NimbleCheckbox_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<NimbleCheckbox>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Fact]
    public void NimbleCheckboxErrorText_AttributeIsSet()
    {
        var checkbox = RenderNimbleCheckboxWithPropertySet(x => x.ErrorText, "bad value");

        checkbox.AssertAttribute("error-text", "bad value");
    }

    [Fact]
    public void NimbleCheckboxErrorVisible_AttributeIsSet()
    {
        var checkbox = RenderNimbleCheckboxWithPropertySet(x => x.ErrorVisible, true);

        checkbox.AssertHasAttribute("error-visible");
    }

    [Fact]
    public void NimbleCheckboxAppearanceIndeterminate_AttributeIsSet()
    {
        var checkbox = RenderNimbleCheckboxWithPropertySet(x => x.AppearanceIndeterminate, true);

        checkbox.AssertHasAttribute("appearance-indeterminate");
    }

    private IRenderedComponent<NimbleCheckbox> RenderNimbleCheckboxWithPropertySet<TProperty>(Expression<Func<NimbleCheckbox, TProperty>> propertyGetter, TProperty propertyValue)
    {
        return Render<NimbleCheckbox>(p => p.Add(propertyGetter, propertyValue));
    }
}
