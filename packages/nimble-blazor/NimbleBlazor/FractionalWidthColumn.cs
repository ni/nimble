namespace NimbleBlazor;

/// <summary>
/// API for table columns supporting fractional width
/// </summary>
public interface FractionalWidthColumn
{
    public double FractionalWidth { get; set; }

    public double? MinPixelWidth { get; set; }
}