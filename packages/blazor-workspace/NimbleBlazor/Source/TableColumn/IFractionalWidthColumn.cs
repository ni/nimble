namespace NimbleBlazor;

/// <summary>
/// API for table columns supporting fractional width
/// </summary>
public interface IFractionalWidthColumn
{
    double FractionalWidth { get; set; }

    double? MinPixelWidth { get; set; }
}