using Xunit;
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for FractionalWidthAPI on <see cref="NimbleTableColumnAnchor"/>
/// </summary>
public class NimbleTableColumnAnchorFractionalWidthTests : FractionalWidthBaseTests<NimbleTableColumnAnchor>
{
    [Fact]
    public void NimbleTableColumnAnchor_WithFractionalWidthAttribute_HasTableMarkup()
    {
        NimbleTableColumn_WithFractionalWidthAttribute_HasTableMarkup();
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithMinPixelWidthAttribute_HasTableMarkup()
    {
        NimbleTableColumn_WithMinPixelWidthAttribute_HasTableMarkup();
    }
}