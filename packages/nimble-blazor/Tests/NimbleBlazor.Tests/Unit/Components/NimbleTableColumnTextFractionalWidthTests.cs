using Xunit;
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for FractionalWidthAPI on <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextFractionalWidthTests : FractionalWidthBaseTests<NimbleTableColumnText>
{
    [Fact]
    public void NimbleTableColumnText_WithFractionalWidthAttribute_HasTableMarkup()
    {
        NimbleTableColumn_WithFractionalWidthAttribute_HasTableMarkup();
    }

    [Fact]
    public void NimbleTableColumnText_WithMinPixelWidthAttribute_HasTableMarkup()
    {
        NimbleTableColumn_WithMinPixelWidthAttribute_HasTableMarkup();
    }
}