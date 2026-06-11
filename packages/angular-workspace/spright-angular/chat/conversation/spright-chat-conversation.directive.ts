import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { toBooleanProperty, type BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
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
    public get autoScroll(): boolean {
        return this.elementRef.nativeElement.autoScroll;
    }

    @Input('auto-scroll') public set autoScroll(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'autoScroll', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ChatConversation>) {}
}
