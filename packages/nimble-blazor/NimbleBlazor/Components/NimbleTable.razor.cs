using System.Text.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
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
    internal static string SetTableDataMethodName = "NimbleBlazor.Table.setData";
    internal static string GetSelectedRecordIdsMethodName = "NimbleBlazor.Table.getSelectedRecordIds";
    internal static string SetSelectedRecordIdsMethodName = "NimbleBlazor.Table.setSelectedRecordIds";
    internal static string CheckTableValidityMethodName = "NimbleBlazor.Table.checkValidity";
    internal static string GetTableValidityMethodName = "NimbleBlazor.Table.getValidity";

    [Inject]
    private IJSRuntime? JSRuntime { get; set; }

    [Parameter]
    public string? IdFieldName { get; set; }

    [Parameter]
    public string? ParentIdFieldName { get; set; }

    [Parameter]
    public TableRowSelectionMode? SelectionMode { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    /// <summary>
    /// Sets the data in the table.
    /// </summary>
    /// <param name="data">The data to set in the table</param>
    public async Task SetDataAsync(IEnumerable<TData> data)
    {
        var options = new JsonSerializerOptions { MaxDepth = 3 };
        await JSRuntime!.InvokeVoidAsync(SetTableDataMethodName, _table, JsonSerializer.Serialize(data, options));
    }

    /// <summary>
    /// Returns the set of selected record IDs.
    /// </summary>
    public async Task<IEnumerable<string>> GetSelectedRecordIdsAsync()
    {
        return await JSRuntime!.InvokeAsync<IEnumerable<string>>(GetSelectedRecordIdsMethodName, _table);
    }

    /// <summary>
    /// Sets the record IDs that should be selected in the table.
    /// </summary>
    /// <param name="recordIds">The record IDs to select in the table</param>
    public async Task SetSelectedRecordIdsAsync(IEnumerable<string> recordIds)
    {
        await JSRuntime!.InvokeAsync<TableValidity>(SetSelectedRecordIdsMethodName, _table, recordIds);
    }

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
    /// Gets or sets a callback that's invoked when 'open' changes on an action menu.
    /// </summary>
    [Parameter]
    public EventCallback<TableActionMenuToggleEventArgs> ActionMenuToggle { get; set; }

    /// <summary>
    /// Gets or sets a callback that's invoked before 'open' changes on an action menu.
    /// </summary>
    [Parameter]
    public EventCallback<TableActionMenuToggleEventArgs> ActionMenuBeforeToggle { get; set; }

    /// <summary>
    /// Gets or sets a callback that's invoked when selection is changed on the table.
    /// </summary>
    [Parameter]
    public EventCallback<TableRowSelectionEventArgs> RowSelectionChange { get; set; }

    /// <summary>
    /// Gets or sets a callback that's invoked when a column's configuration is changed.
    /// </summary>
    [Parameter]
    public EventCallback<TableColumnConfigurationEventArgs> ColumnConfigurationChange { get; set; }

    /// <summary>
    /// Called when 'action-menu-toggle' changes on the web component.
    /// </summary>
    /// <param name="eventArgs">The state of the action menu on the table</param>
    protected async void HandleActionMenuToggle(TableActionMenuToggleEventArgs eventArgs)
    {
        await ActionMenuToggle.InvokeAsync(eventArgs);
    }

    /// <summary>
    /// Called when the 'action-menu-beforetoggle' event is fired on the web component.
    /// </summary>
    /// <param name="eventArgs">The state of the action menu on the table</param>
    protected async void HandleActionMenuBeforeToggle(TableActionMenuToggleEventArgs eventArgs)
    {
        await ActionMenuBeforeToggle.InvokeAsync(eventArgs);
    }

    /// <summary>
    /// Called when the 'selection-change' event is fired on the web component.
    /// </summary>
    /// <param name="eventArgs">The selection state of the table</param>
    protected async void HandleSelectionChange(TableRowSelectionEventArgs eventArgs)
    {
        await RowSelectionChange.InvokeAsync(eventArgs);
    }

    /// <summary>
    /// Called when the 'column-configuration-change' event is fired on the web component.
    /// </summary>
    /// <param name="eventArgs">The configuration of the columns</param>
    protected async void HandleColumnConfigurationChange(TableColumnConfigurationEventArgs eventArgs)
    {
        await ColumnConfigurationChange.InvokeAsync(eventArgs);
    }
}
