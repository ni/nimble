using Xunit;
namespace NimbleBlazor.Tests.Unit.Components;

/// <summary>
/// Tests for GroupableAPI on <see cref="NimbleTableColumnText"/>
/// </summary>
public class NimbleTableColumnTextGroupableTests : GroupableBaseTests<NimbleTableColumnText>
{
    [Fact]
    public void NimbleTableColumnText_WithGroupIndexAttribute_HasTableMarkup()
    {
        NimbleTableColumn_WithGroupIndexAttribute_HasTableMarkup();
    }

    [Fact]
    public void NimbleTableColumnText_WithGroupingDisabledAttribute_HasTableMarkup()
    {
        NimbleTableColumn_WithGroupingDisabledAttribute_HasTableMarkup();
    }
}