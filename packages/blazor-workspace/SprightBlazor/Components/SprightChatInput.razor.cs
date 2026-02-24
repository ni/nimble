using Microsoft.AspNetCore.Components;

namespace SprightBlazor;

public partial class SprightChatInput : ComponentBase
{
    [Parameter]
    public string? Placeholder { get; set; }

    /// <summary>
    /// Gets or sets the label for the send button
    /// </summary>
    [Parameter]
    public string? SendButtonLabel { get; set; }

    /// <summary>
    /// Gets or sets the label for the stop/cancel button
    /// </summary>
    [Parameter]
    public string? StopButtonLabel { get; set; }

    /// <summary>
    /// Gets or sets whether the input is in processing mode
    /// </summary>
    [Parameter]
    public bool? Processing { get; set; }

    [Parameter]
    public string? Value { get; set; }

    /// <summary>
    /// Gets or sets the maximum character length
    /// </summary>
    [Parameter]
    public int? MaxLength { get; set; }

    /// <summary>
    /// Gets or sets the error text
    /// </summary>
    [Parameter]
    public string? ErrorText { get; set; }

    /// <summary>
    /// Gets or sets whether the error is visible
    /// </summary>
    [Parameter]
    public bool? ErrorVisible { get; set; }

    /// <summary>
    /// Gets or sets a callback that is invoked when the send event is raised.
    /// </summary>
    [Parameter]
    public EventCallback<ChatInputSendEventArgs> Send { get; set; }

    /// <summary>
    /// Gets or sets a callback that is invoked when the stop event is raised.
    /// </summary>
    [Parameter]
    public EventCallback<EventArgs> Stop { get; set; }

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

    private async void HandleChatInputSend(ChatInputSendEventArgs eventArgs)
    {
        await Send.InvokeAsync(eventArgs);
    }

    private async void HandleChatInputStop(EventArgs eventArgs)
    {
        await Stop.InvokeAsync(eventArgs);
    }
}
