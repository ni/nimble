import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { type ChatMessageSystem, chatMessageSystemTag } from '@ni/spright-components/dist/esm/chat/message/system';

export type { ChatMessageSystem };
export { chatMessageSystemTag };

/**
 * Directive to provide Angular integration for the chat system message.
 */
@Directive({
    selector: 'spright-chat-message',
    standalone: false
})
export class SprightChatMessageSystemDirective {
    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ChatMessageSystem>) {}
}
