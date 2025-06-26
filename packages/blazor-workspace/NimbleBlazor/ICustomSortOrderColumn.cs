namespace NimbleBlazor;

/// <summary>
/// API for table columns supporting custom sort orders
/// </summary>
public interface ICustomSortOrderColumn
{
    public string? SortByFieldName { get; set; }
}