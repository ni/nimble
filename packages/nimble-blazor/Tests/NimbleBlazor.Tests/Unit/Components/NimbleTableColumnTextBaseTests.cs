using Xunit;
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for NimbleTableColumn API on <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextBaseTests : NimbleTableColumnTests<NimbleTableColumnText>
{
    [Fact]
    public void NimbleTableColumnText_WithSortIndexAttribute_HasTableMarkup()
    {
        NimbleTableColumn_WithSortIndexAttribute_HasTableMarkup();
    }

    [Fact]
    public void NimbleTableColumnText_WithSortDirectionAttribute_HasTableMarkup()
    {
        NimbleTableColumn_WithSortDirectionAttribute_HasTableMarkup();
    }
}