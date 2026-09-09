using System.Globalization;
using Microsoft.AspNetCore.Components;

namespace OkBlazor;

public partial class OkFvSplitter : ComponentBase
{
    /// <summary>
    /// The accessible name for the separator.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Identifies the element that labels the separator.
    /// </summary>
    [Parameter]
    public string? AriaLabelledby { get; set; }

    /// <summary>
    /// Identifies the primary pane controlled by the separator.
    /// </summary>
    [Parameter]
    public string? AriaControls { get; set; }

    /// <summary>
    /// The splitter position as a percentage of the containing layout's width.
    /// </summary>
    [Parameter]
    public double? Position { get; set; }

    /// <summary>
    /// The minimum allowed position.
    /// </summary>
    [Parameter]
    public double? Min { get; set; }

    /// <summary>
    /// The maximum allowed position.
    /// </summary>
    [Parameter]
    public double? Max { get; set; }

    /// <summary>
    /// The percentage-point increment used for keyboard resizing.
    /// </summary>
    [Parameter]
    public double? Step { get; set; }

    /// <summary>
    /// Callback invoked while the splitter position changes.
    /// </summary>
    [Parameter]
    public EventCallback<ChangeEventArgs> Input { get; set; }

    /// <summary>
    /// Callback invoked when a splitter resize is committed.
    /// </summary>
    [Parameter]
    public EventCallback<ChangeEventArgs> Change { get; set; }

    /// <summary>
    /// Any additional attributes that did not match known properties.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    protected string? PositionAsString => FormatNumber(Position);

    protected string? MinAsString => FormatNumber(Min);

    protected string? MaxAsString => FormatNumber(Max);

    protected string? StepAsString => FormatNumber(Step);

    private static string? FormatNumber(double? value) => value?.ToString(CultureInfo.InvariantCulture);
}