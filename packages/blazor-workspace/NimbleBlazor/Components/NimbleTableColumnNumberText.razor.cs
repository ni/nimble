﻿using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTableColumnNumberText : NimbleTableColumn, IFractionalWidthColumn, IGroupableColumn, ISortableColumn
{
    /// <summary>
    /// Gets or sets the field in the element representing a row of data in a <see cref="NimbleTable{TData}"/>to display
    /// </summary>
    [Parameter]
    [DisallowNull]
    public string FieldName { get; set; } = null!;

    /// <summary>
    /// The placeholder text to display when the field value is null for a record.
    /// </summary>
    [Parameter]
    public string? Placeholder { get; set; }

    /// <summary>
    /// The fractional/proportional width to use for this column
    /// </summary>
    [Parameter]
    public double FractionalWidth { get; set; } = 1;

    /// <summary>
    /// The minimum width (in pixels) for this column
    /// </summary>
    [Parameter]
    public double? MinPixelWidth { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Specifies the grouping precedence of the column within the set of all columns participating in grouping.
    /// Columns are rendered in the grouping tree from lowest group-index as the tree root to highest
    /// group-index as tree leaves.
    /// </summary>
    [Parameter]
    public int? GroupIndex { get; set; }

    /// <summary>
    /// Whether or not this column can be used to group rows by
    /// </summary>
    [Parameter]
    public bool? GroupingDisabled { get; set; }

    /// <summary>
    /// The direction the column is sorted.
    /// </summary>
    [Parameter]
    public TableColumnSortDirection? SortDirection { get; set; }

    /// <summary>
    /// The index for sorting the column. When multiple columns are sorted,
    /// they will be sorted from lowest index to highest index.
    /// </summary>
    [Parameter]
    public int? SortIndex { get; set; }

    /// <summary>
    /// Whether or not sorting is disabled on the column. If sorting is disabled, the column
    /// will not be sorted even if <see cref="SortIndex"/> and <see cref="SortDirection"/> are configured.
    /// </summary>
    [Parameter]
    public bool? SortingDisabled { get; set; }

    /// <summary>
    /// Formatting scheme to use
    /// </summary>
    [Parameter]
    public NumberTextFormat? Format { get; set; }

    /// <summary>
    /// The alignment of the value with the table cell
    /// </summary>
    [Parameter]
    public NumberTextAlignment? Alignment { get; set; }

    /// <summary>
    /// The number of digits to display after the decimal place when the column's format is decimal.
    /// Setting both DecimalDigits and DecimalMaximumDigits results in an invalid state.
    /// </summary>
    [Parameter]
    public int? DecimalDigits { get; set; }

    /// <summary>
    /// The maximum number of digits to display after the decimal place when the column's format is decimal.
    /// Setting both DecimalDigits and DecimalMaximumDigits results in an invalid state.
    /// </summary>
    [Parameter]
    public int? DecimalMaximumDigits { get; set; }
}