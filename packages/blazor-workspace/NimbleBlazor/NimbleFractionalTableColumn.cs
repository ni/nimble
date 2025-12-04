using System.Globalization;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public abstract class NimbleFractionalTableColumn : NimbleTableColumn, IFractionalWidthColumn
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
    /// The fractional/proportional width formatted with the invariant culture.
    /// </summary>
    protected string FractionalWidthAsString()
    {
        return FractionalWidth.ToString(CultureInfo.InvariantCulture);
    }

    /// <summary>
    /// The minimum column width formatted with the invariant culture.
    /// </summary>
    protected string? MinPixelWidthAsString()
    {
        return MinPixelWidth?.ToString(CultureInfo.InvariantCulture);
    }
}
