using Microsoft.AspNetCore.Components;

namespace NimbleBlazor.Components;

public partial class NimbleDrawer : ComponentBase
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    [Parameter]
    public DrawerLocation? Location { get; set; }

    /// <summary>
    /// Drawer state (Opening/Opened/Closing/Closed).
    /// </summary>
    /// <remarks>
    /// When setting State, 2-way binding (@bind-State) should always be used,
    /// so this property correctly reflects the State from the web component
    /// (which updates State as it animates between opening/opened and
    /// closing/closed).
    /// </remarks>
    [Parameter]
    public DrawerState? State { get; set; }

    /// <summary>
    /// Gets or sets a callback that's invoked when the State changes
    /// </summary>
    [Parameter] public EventCallback<DrawerState?> StateChanged { get; set; }

    [Parameter]
    public bool? Modal { get; set; }

    [Parameter]
    public bool? PreventDismiss { get; set; }

    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    /// <summary>
    /// Show/Open the drawer.
    /// </summary>
    /// <remarks>
    /// If using 2-way binding with the State property, update State via the
    /// bound property instead of using this method.
    /// </remarks>
    public void Show()
    {
        State = DrawerState.Opening;
    }

    /// <summary>
    /// Hide/Close the drawer.
    /// </summary>
    /// <remarks>
    /// If using 2-way binding with the State property, update State via the
    /// bound property instead of using this method.
    /// </remarks>
    public void Hide()
    {
        State = DrawerState.Closing;
    }

    /// <summary>
    /// Called when state changes on the web component
    /// </summary>
    /// <param name="value">New value of drawer state</param>
    protected async void UpdateDrawerState(DrawerState value)
    {
        State = value;
        await StateChanged.InvokeAsync(value);
    }
}
