using Xunit;
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for GroupableAPI on <see cref="NimbleTableColumnAnchor"/>
/// </summary>
public class NimbleTableColumnAnchorGroupableTests : GroupableBaseTests<NimbleTableColumnAnchor>
{
    [Fact]
    public void NimbleTableColumnAnchor_WithGroupIndexAttribute_HasTableMarkup()
    {
        NimbleTableColumn_WithGroupIndexAttribute_HasTableMarkup();
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithGroupingDisabledAttribute_HasTableMarkup()
    {
        NimbleTableColumn_WithGroupingDisabledAttribute_HasTableMarkup();
    }
}