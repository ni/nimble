using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor;

public partial class NimbleTableColumnMenuButton : NimbleTableColumn, IFractionalWidthColumn
{
    /// <summary>
    /// Gets or sets the field in the element representing a row of data in a <see cref="NimbleTable{TData}"/>to display
    /// </summary>
    [Parameter]
    [DisallowNull]
    public string FieldName { get; set; } = null!;

    /// <summary>
    /// Gets or sets the name of the slot within the <see cref="NimbleTable{TData}"/> where the menu associated with the
    /// column's menu button will be provided.
    /// </summary>
    [Parameter]
    [DisallowNull]
    public string MenuSlot { get; set; } = null!;

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

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a callback that's invoked when 'open' changes on a menu button within the column.
    /// </summary>
    [Parameter]
    public EventCallback<TableColumnMenuButtonToggleEventArgs> MenuButtonColumnToggle { get; set; }

    /// <summary>
    /// Gets or sets a callback that's invoked before the 'open' state changes on a menu button within the column.
    /// </summary>
    [Parameter]
    public EventCallback<TableColumnMenuButtonToggleEventArgs> MenuButtonColumnBeforeToggle { get; set; }

    /// <summary>
    /// Called when the 'menu-button-column-toggle' event is fired on the web component
    /// </summary>
    /// <param name="eventArgs">The details of the event.</param>
    protected async void HandleMenuButtonColumnToggle(TableColumnMenuButtonToggleEventArgs eventArgs)
    {
        await MenuButtonColumnToggle.InvokeAsync(eventArgs);
    }

    /// <summary>
    /// Called when the 'menu-button-column-beforetoggle' event is fired on the web component
    /// </summary>
    /// <param name="eventArgs">The details of the event.</param>
    protected async void HandleMenuButtonColumnBeforeToggle(TableColumnMenuButtonToggleEventArgs eventArgs)
    {
        await MenuButtonColumnBeforeToggle.InvokeAsync(eventArgs);
    }
}
