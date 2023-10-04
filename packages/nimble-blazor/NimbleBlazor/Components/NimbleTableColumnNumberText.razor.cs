using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTableColumnNumberText : NimbleTableColumn, IFractionalWidthColumn, IGroupableColumn
{
    /// <summary>
    /// Gets or sets the field in the element representing a row of data in a <see cref="NimbleTable{TData}"/>to display
    /// </summary>
    [Parameter]
    [DisallowNull]
    public string FieldName { get; set; } = null!;

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
    /// </summary>
    [Parameter]
    public int? DecimalDigits { get; set; }
}