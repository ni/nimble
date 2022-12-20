using System.Text.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace NimbleBlazor;

/// <summary>
/// A table component
/// </summary>
/// <typeparam name="TData">Represents the type for a row of data in the table (an element of the <see cref="Data"/>).</typeparam>
/// <remarks>The type represented by <see cref="TData"/> should not have any hierarchy. All aspects that can be serialized
/// should be at the top-level.</remarks>
public partial class NimbleTable<TData> : ComponentBase
{
    private ElementReference _table;
    private bool _shouldRender = false;
    private IEnumerable<TData> _data = Enumerable.Empty<TData>();
    internal static string SetTableDataMethodName = "NimbleBlazor.Table.setData";

    [Inject]
    private IJSRuntime? JSRuntime { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the data for the table.
    /// </summary>
    [Parameter]
    public IEnumerable<TData> Data
    {
        get
        {
            return _data;
        }
        set
        {
            _data = value;
            _shouldRender = true;
        }
    }

    /// <summary>
    /// Gets or sets a callback that's invoked when the data changes
    /// </summary>
    [Parameter]
    public EventCallback<IEnumerable<TData>> DataChanged { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    /// <inheritdoc/>
    /// <exception cref="JsonException"></exception>
    protected override Task OnAfterRenderAsync(bool firstRender)
    {
        var options = new JsonSerializerOptions { MaxDepth = 3 };
        _shouldRender = false;
        return JSRuntime!.InvokeVoidAsync(SetTableDataMethodName, JsonSerializer.Serialize(Data, options), _table).AsTask();
    }

    protected override bool ShouldRender()
    {
        return _shouldRender;
    }
}
