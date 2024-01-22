using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace NimbleBlazor;

/// <summary>
/// A banner component for displaying persistent messages
/// </summary>
public partial class NimbleWaferMap : ComponentBase
{
    private ElementReference _waferMap;
    internal static string GetWaferMapValidityMethodName = "NimbleBlazor.WaferMap.getValidity";

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
    public IEnumerable<string>? HighlightedTags { get; set; }

    /// <summary>
    /// </summary>
    [Parameter]
    public IEnumerable<WaferMapDie>? Dies { get; set; }

    /// <summary>
    /// </summary>
    [Parameter]
    public WaferMapColorScale? ColorScale { get; set; }

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
}
