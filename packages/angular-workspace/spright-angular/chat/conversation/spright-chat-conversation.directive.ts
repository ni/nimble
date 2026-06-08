import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type ChatConversation, chatConversationTag } from '@ni/spright-components/dist/esm/chat/conversation';

export type { ChatConversation };
export { chatConversationTag };

/**
 * Directive to provide Angular integration for the chat conversation.
 */
@Directive({
    selector: 'spright-chat-conversation',
    standalone: false
})
export class SprightChatConversationDirective {
    public get autoScroll(): boolean | undefined {
        return this.elementRef.nativeElement.autoScroll;
    }

    @Input('auto-scroll') public set autoScroll(value: boolean | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'autoScroll', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ChatConversation>) {}
}
