namespace NimbleBlazor;

/// <summary>
/// API for table columns supporting sorting
/// </summary>
public interface ISortableColumn
{
    /// <summary>
    /// The direction the column is sorted.
    /// </summary>
    public TableColumnSortDirection? SortDirection { get; set; }

    /// <summary>
    /// The index for sorting the column. When multiple columns are sorted,
    /// they will be sorted from lowest index to highest index.
    /// </summary>
    public int? SortIndex { get; set; }

    /// <summary>
    /// Whether or not sorting is disabled on the column. If sorting is disabled, the column
    /// will not be sorted even if <see cref="SortIndex"/> and <see cref="SortDirection"/> are configured.
    /// </summary>
    public bool? SortingDisabled { get; set; }
}
