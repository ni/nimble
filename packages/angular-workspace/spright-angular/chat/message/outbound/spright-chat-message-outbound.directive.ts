import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { type ChatMessageOutbound, chatMessageOutboundTag } from '@ni/spright-components/dist/esm/chat/message/outbound';

export type { ChatMessageOutbound };
export { chatMessageOutboundTag };

/**
 * Directive to provide Angular integration for the chat outbound message.
 */
@Directive({
    selector: 'spright-chat-message',
    standalone: false
})
export class SprightChatMessageOutboundDirective {
    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ChatMessageOutbound>) {}
}
