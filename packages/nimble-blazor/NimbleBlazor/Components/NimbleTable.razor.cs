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
    private bool _dataUpdated = false;
    private IEnumerable<TData> _data = Enumerable.Empty<TData>();
    internal static string SetTableDataMethodName = "NimbleBlazor.Table.setData";
    internal static string CheckTableValidityMethodName = "NimbleBlazor.Table.checkValidity";
    internal static string GetTableValidityMethodName = "NimbleBlazor.Table.getValidity";

    [Inject]
    private IJSRuntime? JSRuntime { get; set; }

    [Parameter]
    public string? IdFieldName { get; set; }

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
            _dataUpdated = true;
        }
    }

    /// <summary>
    /// Gets or sets a callback that's invoked when the data changes
    /// </summary>
    [Parameter]
    public EventCallback<IEnumerable<TData>> DataChanged { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    /// <summary>
    /// Returns whether or not the table is valid.
    /// </summary>
    public async Task<bool> CheckValidityAsync()
    {
        return await JSRuntime!.InvokeAsync<bool>(CheckTableValidityMethodName, _table);
    }

    /// <summary>
    /// Returns the validity state of the table.
    /// </summary>
    public async Task<ITableValidity> GetValidityAsync()
    {
        return await JSRuntime!.InvokeAsync<TableValidity>(GetTableValidityMethodName, _table);
    }

    /// <summary>
    /// Gets or sets a callback that's invoked when 'open' changes on an action menu
    /// </summary>
    [Parameter]
    public EventCallback<TableActionMenuToggleEventArgs> ActionMenuToggle { get; set; }

    /// <summary>
    /// Gets or sets a callback that's invoked before 'open' changes on an action menu
    /// </summary>
    [Parameter]
    public EventCallback<TableActionMenuToggleEventArgs> ActionMenuBeforeToggle { get; set; }

    /// <summary>
    /// Called when 'action-menu-toggle' changes on the web component.
    /// </summary>
    /// <param name="eventArgs">The state of the action menu on the table</param>
    protected async void HandleActionMenuToggle(TableActionMenuToggleEventArgs eventArgs)
    {
        await ActionMenuToggle.InvokeAsync(eventArgs);
    }

    /// <summary>
    /// Called when the 'action-menu-beforetoggle' event is fired on the web component
    /// </summary>
    /// <param name="eventArgs">The state of the action menu on the table</param>
    protected async void HandleActionMenuBeforeToggle(TableActionMenuToggleEventArgs eventArgs)
    {
        await ActionMenuBeforeToggle.InvokeAsync(eventArgs);
    }

    /// <inheritdoc/>
    /// <exception cref="JsonException"></exception>
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        var options = new JsonSerializerOptions { MaxDepth = 3 };
        if (_dataUpdated)
        {
            await JSRuntime!.InvokeVoidAsync(SetTableDataMethodName, _table, JsonSerializer.Serialize(Data, options));
        }
        _dataUpdated = false;
    }
}
