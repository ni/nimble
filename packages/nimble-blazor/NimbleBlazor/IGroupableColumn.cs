namespace NimbleBlazor;

/// <summary>
/// API for table columns supporting grouping
/// </summary>
public interface IGroupableColumn
{
    public int? GroupIndex { get; set; }

    public bool? GroupingDisabled { get; set; }
}