using BlazorWorkspace.Testing.Unit;
using Bunit;
using Xunit;

namespace SprightBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for <see cref="SprightLabelProviderChat"/>.
/// </summary>
public class SprightLabelProviderChatTests : BunitTestBase
{
    [Fact]
    public void SprightLabelProviderChat_Render_HasLabelProviderMarkup()
    {
        var labelProvider = Render<SprightLabelProviderChat>();

        Assert.NotNull(labelProvider.Find("spright-label-provider-chat"));
    }

    [Fact]
    public void SprightLabelProviderChat_SupportsAdditionalAttributes()
    {
        var exception = Record.Exception(() => Render<SprightLabelProviderChat>(parameters => parameters.AddUnmatched("class", "foo")));
        Assert.Null(exception);
    }

    [Theory]
    [InlineData(nameof(SprightLabelProviderChat.Send))]
    [InlineData(nameof(SprightLabelProviderChat.Stop))]
    public void SprightLabelProviderChat_LabelIsSet(string propertyName)
    {
        var labelValue = propertyName + "UpdatedValue";
        var labelProvider = Render<SprightLabelProviderChat>(parameters => parameters.AddUnmatched(AttributeHelpers.ConvertToAttributeString(propertyName), labelValue));

        labelProvider.AssertAttribute(AttributeHelpers.ConvertToAttributeString(propertyName), labelValue);
    }
}