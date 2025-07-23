using Microsoft.AspNetCore.Components;

namespace SprightBlazor;

public partial class SprightChatInput : ComponentBase
{
    [Parameter]
    public string? Placeholder { get; set; }

    [Parameter]
    public string? Value { get; set; }

    /// <summary>
    /// Gets or sets a callback that's invoked when a column's configuration is changed.
    /// </summary>
    [Parameter]
    public EventCallback<ChatInputSendEventArgs> Send { get; set; }

    /// <summary>
    /// The child content of the element.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Any additional attributes that did not match known properties.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; }

    /// <summary>
    /// Called when the 'row-expand-toggle' event is fired on the web component.
    /// </summary>
    /// <param name="eventArgs">The toggle state of a table row</param>
    protected async void HandleChatInputSend(ChatInputSendEventArgs eventArgs)
    {
        await Send.InvokeAsync(eventArgs);
    }
}
