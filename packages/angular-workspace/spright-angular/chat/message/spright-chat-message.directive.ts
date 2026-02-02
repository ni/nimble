import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type ChatMessage, chatMessageTag } from '@ni/spright-components/dist/esm/chat/message';
import { ChatMessageType } from '@ni/spright-components/dist/esm/chat/message/types';

export type { ChatMessage };
export { ChatMessageType };
export { chatMessageTag };

/**
 * Directive to provide Angular integration for the chat message.
 * @deprecated Use specific message component types instead
 */
@Directive({
    selector: 'spright-chat-message',
    standalone: false
})
export class SprightChatMessageDirective {
    public get messageType(): ChatMessageType {
        return this.elementRef.nativeElement.messageType;
    }

    @Input('message-type') public set messageType(value: ChatMessageType) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'messageType', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ChatMessage>) {}
}
