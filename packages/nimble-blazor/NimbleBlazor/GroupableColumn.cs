namespace NimbleBlazor;

/// <summary>
/// API for table columns supporting grouping
/// </summary>
public interface GroupableColumn
{
    public int? GroupIndex { get; set; }

    public bool? GroupingDisabled { get; set; }
}