using System.Text.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace NimbleBlazor;

/// <summary>
/// A visualization widget which displays the location and color code of integrated circuits on a silicon wafer.
/// </summary>
public partial class NimbleWaferMap : ComponentBase
{
    private ElementReference _waferMap;
    private bool _diesUpdated = false;
    private IEnumerable<WaferMapDie>? _dies = Enumerable.Empty<WaferMapDie>();
    private bool _colorScaleUpdated = false;
    private WaferMapColorScale? _colorScale;
    private bool _highlightedTagsUpdated = false;
    private IEnumerable<string>? _highlightedTags = Enumerable.Empty<string>();
    internal static string GetWaferMapValidityMethodName = "NimbleBlazor.WaferMap.getValidity";
    internal static string SetWaferMapDiesMethodName = "NimbleBlazor.WaferMap.setDies";
    internal static string SetWaferMapColorScaleMethodName = "NimbleBlazor.WaferMap.setColorScale";
    internal static string SetWaferMapHighlightedTagsMethodName = "NimbleBlazor.WaferMap.setHighlightedTags";

    [Inject]
    private IJSRuntime? JSRuntime { get; set; }

    /// <summary>
    /// Represents the starting point and the direction of the two axes, X and Y, which are used for displaying the die grid on the wafer map canvas.
    /// </summary>
    [Parameter]
    public WaferMapOriginLocation? OriginLocation { get; set; }

    /// <summary>
    /// Represents the X coordinate of the minimum corner of the the grid bounding box for rendering the wafer map.
    /// </summary>
    [Parameter]
    public double? GridMinX { get; set; }

    /// <summary>
    /// Represents the Y coordinate of the minimum corner of the the grid bounding box for rendering the wafer map.
    /// </summary>
    [Parameter]
    public double? GridMaxX { get; set; }

    /// <summary>
    /// Represents the X coordinate of the maximum corner of the the grid bounding box for rendering the wafer map.
    /// </summary>
    [Parameter]
    public double? GridMinY { get; set; }

    /// <summary>
    /// Represents the Y coordinate of the maximum corner of the the grid bounding box for rendering the wafer map.
    /// </summary>
    [Parameter]
    public double? GridMaxY { get; set; }

    /// <summary>
    /// Represents the orientation of the notch on the wafer map outline.
    /// </summary>
    [Parameter]
    public WaferMapOrientation? Orientation { get; set; }

    /// <summary>
    /// Represents the number of characters allowed to be displayed within a single die, including the label suffix.
    /// </summary>
    [Parameter]
    public double? MaxCharacters { get; set; }

    /// <summary>
    /// Represents a boolean value that determines if the die labels in the wafer map view are shown or not. Default value is false.
    /// </summary>
    [Parameter]
    public bool? DieLabelsHidden { get; set; }

    /// <summary>
    /// Represents a string that can be added as a label in the end of the each data information in the wafer map dies value.
    /// </summary>
    [Parameter]
    public string? DieLabelsSuffix { get; set; }

    /// <summary>
    /// Represents an Enum value that determent if the colorScale is represent a continues gradient values (linear), or is set categorically (ordinal).
    /// </summary>
    [Parameter]
    public WaferMapColorScaleMode? ColorScaleMode { get; set; }

    /// <summary>
    /// Represents a list of strings of dies that will be highlighted in the wafer map view.
    /// </summary>
    [Parameter]
    public IEnumerable<string>? HighlightedTags
    {
        get
        {
            return _highlightedTags;
        }
        set
        {
            _highlightedTags = value;
            _highlightedTagsUpdated = true;
        }
    }

    /// <summary>
    /// Represents the input data, an array of `WaferMapDie`, which fills the wafer map with content
    /// </summary>
    [Parameter]
    public IEnumerable<WaferMapDie>? Dies
    {
        get
        {
            return _dies;
        }
        set
        {
            _dies = value;
            _diesUpdated = true;
        }
    }

    /// <summary>
    /// Represents the color spectrum which shows the status of the dies on the wafer.
    /// </summary>
    [Parameter]
    public WaferMapColorScale? ColorScale
    {
        get
        {
            return _colorScale;
        }
        set
        {
            _colorScale = value;
            _colorScaleUpdated = true;
        }
    }

    /// <summary>
    /// Will be triggered to inform the user that the state of hovering over a die has changed.
    /// </summary>
    [Parameter]
    public EventCallback<WaferMapHoverDieChangedEventArgs> HoverDieChanged { get; set; }

    /// <summary>
    /// Returns an object of boolean values that represents the validity states that the wafer map's configuration can be in.
    /// </summary>
    public async Task<IWaferMapValidity> GetValidityAsync()
    {
        return await JSRuntime!.InvokeAsync<WaferMapValidity>(GetWaferMapValidityMethodName, _waferMap);
    }

    /// <summary>
    /// Any additional attributes that did not match known properties.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    /// <inheritdoc/>
    /// <exception cref="JsonException"></exception>
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        var options = new JsonSerializerOptions { MaxDepth = 3 };
        if (_diesUpdated)
        {
            await JSRuntime!.InvokeVoidAsync(SetWaferMapDiesMethodName, _waferMap, JsonSerializer.Serialize(_dies, options));
        }
        _diesUpdated = false;
        if (_colorScaleUpdated)
        {
            await JSRuntime!.InvokeVoidAsync(SetWaferMapColorScaleMethodName, _waferMap, JsonSerializer.Serialize(_colorScale, options));
        }
        _colorScaleUpdated = false;
        if (_highlightedTagsUpdated)
        {
            await JSRuntime!.InvokeVoidAsync(SetWaferMapHighlightedTagsMethodName, _waferMap, JsonSerializer.Serialize(_highlightedTags, options));
        }
        _highlightedTagsUpdated = false;
    }
}
