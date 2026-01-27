import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { type ChatMessageInbound, chatMessageInboundTag } from '@ni/spright-components/dist/esm/chat/message/inbound';

export type { ChatMessageInbound };
export { chatMessageInboundTag };

/**
 * Directive to provide Angular integration for the chat inbound message.
 */
@Directive({
    selector: 'spright-chat-message',
    standalone: false
})
export class SprightChatMessageInboundDirective {
    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ChatMessageInbound>) {}
}
