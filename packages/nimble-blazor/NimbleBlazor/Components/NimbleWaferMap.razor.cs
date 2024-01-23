using System.Text.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace NimbleBlazor;

/// <summary>
/// A banner component for displaying persistent messages
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
    /// </summary>
    [Parameter]
    public WaferMapOriginLocation? OriginLocation { get; set; }

    /// <summary>
    /// </summary>
    [Parameter]
    public double? GridMinX { get; set; }

    /// <summary>
    /// </summary>
    [Parameter]
    public double? GridMaxX { get; set; }

    /// <summary>
    /// </summary>
    [Parameter]
    public double? GridMinY { get; set; }

    /// <summary>
    /// </summary>
    [Parameter]
    public double? GridMaxY { get; set; }

    /// <summary>
    /// </summary>
    [Parameter]
    public WaferMapOrientation? Orientation { get; set; }

    /// <summary>
    /// </summary>
    [Parameter]
    public double? MaxCharacters { get; set; }

    /// <summary>
    /// </summary>
    [Parameter]
    public bool? DieLabelsHidden { get; set; }

    /// <summary>
    /// </summary>
    [Parameter]
    public string? DieLabelsSuffix { get; set; }

    /// <summary>
    /// </summary>
    [Parameter]
    public WaferMapColorScaleMode? ColorScaleMode { get; set; }

    /// <summary>
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
    /// Gets or sets a callback that's invoked before 'open' changes on an action menu.
    /// </summary>
    [Parameter]
    public EventCallback<WaferMapHoverDieChangedEventArgs> HoverDieChanged { get; set; }

    /// <summary>
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
