using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTableColumnText : NimbleTableColumn, IFractionalWidthColumn, IGroupableColumn
{
    /// <summary>
    /// Gets or sets the field in the element representing a row of data in a <see cref="NimbleTable{TData}"/>to display
    /// </summary>
    [Parameter]
    [DisallowNull]
    public string FieldName { get; set; } = null!;

    /// <summary>
    /// The text to show when no value is available for a particular cell in the column of a <see cref="NimbleTable{TData}"/>
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
}
