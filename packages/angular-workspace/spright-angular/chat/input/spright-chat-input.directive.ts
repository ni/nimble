import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';
import { type ChatInput, chatInputTag } from '@ni/spright-components/dist/esm/chat/input';
import { type ChatInputSendEventDetail } from '@ni/spright-components/dist/esm/chat/input/types';

export type { ChatInput };
export type { ChatInputSendEventDetail };
export { chatInputTag };

/**
 * Directive to provide Angular integration for the chat input.
 */
@Directive({
    selector: 'spright-chat-input'
})
export class SprightChatInputDirective {
    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ChatInput>) {}
}
