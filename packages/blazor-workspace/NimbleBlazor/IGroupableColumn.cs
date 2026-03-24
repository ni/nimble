namespace NimbleBlazor;

/// <summary>
/// API for table columns supporting grouping
/// </summary>
public interface IGroupableColumn
{
    int? GroupIndex { get; set; }

    bool? GroupingDisabled { get; set; }
}