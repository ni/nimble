using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace NimbleBlazor;

public partial class NimbleMenuButton : ComponentBase
{
    private ElementReference _menuButtonElement;

    internal static string OpenMenuButtonMethodName = "NimbleBlazor.MenuButton.open";
    internal static string CloseMenuButtonMethodName = "NimbleBlazor.MenuButton.close";
    internal static string IsMenuButtonOpenMethodName = "NimbleBlazor.MenuButton.isOpen";

    /// <summary>
    /// Gets or sets the appearance of the menu button.
    /// </summary>
    [Parameter]
    public ButtonAppearance? Appearance { get; set; }

    /// <summary>
    /// Gets or sets the appearance variant of the menu button.
    /// </summary>
    [Parameter]
    public ButtonAppearanceVariant? AppearanceVariant { get; set; }

    /// <summary>
    /// Gets or sets the position of the menu relative to the button.
    /// </summary>
    [Parameter]
    public MenuButtonPosition? Position { get; set; }

    /// <summary>
    /// Gets or sets whether or not the button is disabled.
    /// </summary>
    [Parameter]
    public bool? Disabled { get; set; }

    /// <summary>
    /// Gets or sets whether or not the text content within the button should be hidden.
    /// </summary>
    [Parameter]
    public bool? ContentHidden { get; set; }

    /// <summary>
    /// Gets or sets whether or not the button should be auto focused.
    /// </summary>
    [Parameter]
    public bool? AutoFocus { get; set; }

    /// <summary>
    /// Gets or sets the child content to be rendered inside the <see cref="NimbleMenuButton"/>.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a callback that's invoked when the menu open state changes.
    /// </summary>
    [Parameter]
    public EventCallback<MenuButtonToggleEventArgs> Toggle { get; set; }

    /// <summary>
    /// Gets or sets a callback that's invoked before the menu open state changes.
    /// </summary>
    [Parameter]
    public EventCallback<MenuButtonToggleEventArgs> BeforeToggle { get; set; }

    [Parameter]
    public EventCallback<EventArgs> Blur { get; set; }

    [Inject]
    private IJSRuntime? JSRuntime { get; set; }

    /// <summary>
    /// Called when the menu button's open state changes.
    /// </summary>
    /// <param name="eventArgs">The state of the menu button</param>
    protected async void HandleToggle(MenuButtonToggleEventArgs eventArgs)
    {
        await Toggle.InvokeAsync(eventArgs);
    }

    /// <summary>
    /// Called when the 'beforetoggle' event is fired on the web component
    /// </summary>
    /// <param name="eventArgs">The state of the menu button</param>
    protected async void HandleBeforeToggle(MenuButtonToggleEventArgs eventArgs)
    {
        await BeforeToggle.InvokeAsync(eventArgs);
    }

    protected async void HandleBlur(EventArgs e)
    {
        await Blur.InvokeAsync(e);
    }

    /// <summary>
    /// Opens the menu.
    /// </summary>
    public Task OpenAsync()
    {
        return JSRuntime!.InvokeVoidAsync(OpenMenuButtonMethodName, _menuButtonElement).AsTask();
    }

    /// <summary>
    /// Closes the menu.
    /// </summary>
    public Task CloseAsync()
    {
        return JSRuntime!.InvokeVoidAsync(CloseMenuButtonMethodName, _menuButtonElement).AsTask();
    }

    /// <summary>
    /// Gets whether the menu is open.
    /// </summary>
    public ValueTask<bool> IsOpenAsync()
    {
        return JSRuntime!.InvokeAsync<bool>(IsMenuButtonOpenMethodName, _menuButtonElement);
    }

    /// <summary>
    /// Gets or sets the additional attributes on the <see cref="NimbleMenuButton"/>.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
