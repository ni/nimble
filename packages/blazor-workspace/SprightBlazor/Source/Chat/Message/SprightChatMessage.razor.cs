using Microsoft.AspNetCore.Components;

namespace SprightBlazor;

/// <summary>
/// SprightChatMessage is deprecated. Use specific message component types instead.
/// </summary>
public partial class SprightChatMessage : ComponentBase
{
    /// <summary>
    /// The message type of the message
    /// </summary>
    [Parameter]
    public ChatMessageType? MessageType { get; set; }

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
}
