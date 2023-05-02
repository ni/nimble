using Xunit;
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for NimbleTableColumn API on <see cref="NimbleTableColumnAnchor"/>
/// </summary>
public class NimbleTableColumnAnchorBaseTests : NimbleTableColumnTests<NimbleTableColumnAnchor>
{
    [Fact]
    public void NimbleTableColumnAnchor_WithSortIndexAttribute_HasTableMarkup()
    {
        NimbleTableColumn_WithSortIndexAttribute_HasTableMarkup();
    }

    [Fact]
    public void NimbleTableColumnAnchor_WithSortDirectionAttribute_HasTableMarkup()
    {
        NimbleTableColumn_WithSortDirectionAttribute_HasTableMarkup();
    }
}