using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTableColumnMapping<TKey> : NimbleTableColumnEnumBase<TKey>, IFractionalWidthColumn
{
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
    /// Sets the width mode on the column.
    /// </summary>
    [Parameter]
    public MappingColumnWidthMode? WidthMode { get; set; }
}
