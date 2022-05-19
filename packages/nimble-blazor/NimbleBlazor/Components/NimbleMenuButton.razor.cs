using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Components;

namespace NimbleBlazor.Components;

public partial class NimbleMenuButton : ComponentBase
{
    /// <summary>
    /// Gets or sets the appearance of the menu button.
    /// </summary>
    [Parameter]
    public ButtonAppearance? Appearance { get; set; }

    /// <summary>
    /// Gets or sets whether or not the menu is open.
    /// </summary>
    [Parameter]
    public bool? Open { get; set; }

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
    /// Gets or sets a callback that's invoked when 'open' changes
    /// </summary>
    [Parameter]
    public EventCallback<bool?> OpenChanged { get; set; }

    /// <summary>
    /// Called when 'open' changes on the web component.
    /// </summary>
    /// <param name="value">New value of open</param>
    protected async void UpdateOpen(bool? value)
    {
        Open = value;
        await OpenChanged.InvokeAsync(value);
    }

    /// <summary>
    /// Gets or sets the additional attributes on the <see cref="NimbleMenuButton"/>.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }
}
