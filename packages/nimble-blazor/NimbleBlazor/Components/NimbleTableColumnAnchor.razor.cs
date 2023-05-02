using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTableColumnAnchor : NimbleTableColumn, FractionalWidthColumn, GroupableColumn
{
    /// <summary>
    /// Gets or sets the link label field in the element representing a row of data in a <see cref="NimbleTable{TData}"/>to display
    /// </summary>
    [Parameter]
    [DisallowNull]
    public string LabelFieldName { get; set; } = null!;

    /// <summary>
    /// Gets or sets the link href field in the element representing a row of data in a <see cref="NimbleTable{TData}"/>to display
    /// </summary>
    [Parameter]
    [DisallowNull]
    public string HrefFieldName { get; set; } = null!;

    /// <summary>
    /// The text to show when no label value is available for a particular cell in the column of a <see cref="NimbleTable{TData}"/>
    /// </summary>
    [Parameter]
    public string? Placeholder { get; set; }

    /// <summary>
    /// The appearance of the anchor.
    /// </summary>
    [Parameter]
    public AnchorAppearance? Appearance { get; set; }

    /// <summary>
    /// Whether the underline is hidden except on hover.
    /// </summary>
    [Parameter]
    public bool UnderlineHidden { get; set; }

    /// <summary>
    /// Hints at the human language of the linked URL. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a for more information.
    /// </summary>
    [Parameter]
    public string? HrefLang { get; set; }

    /// <summary>
    /// A space-separated list of URLs. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a for more information.
    /// </summary>
    [Parameter]
    public string? Ping { get; set; }

    /// <summary>
    /// How much of the referrer to send when following the link. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a for more information.
    /// </summary>
    [Parameter]
    public string? ReferrerPolicy { get; set; }

    /// <summary>
    /// The relationship of the linked URL as space-separated link types. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a for more information.
    /// </summary>
    [Parameter]
    public string? Rel { get; set; }

    /// <summary>
    /// Where to display the linked URL, as the name for a browsing context. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a for more information.
    /// </summary>
    [Parameter]
    public string? Target { get; set; }

    /// <summary>
    /// Hints at the linked URL's format with a MIME type. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a for more information.
    /// </summary>
    [Parameter]
    public string? Type { get; set; }

    /// <summary>
    /// Causes the browser to treat the linked URL as a download. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a for more information.
    /// </summary>
    [Parameter]
    public string? Download { get; set; }

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

    [Parameter]
    public RenderFragment? ChildContent { get; set; }
}
