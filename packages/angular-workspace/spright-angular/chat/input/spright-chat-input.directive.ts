import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';
import { type ChatInput, chatInputTag } from '@ni/spright-components/dist/esm/chat/input';
import { type ChatInputSubmitEventDetail } from '@ni/spright-components/dist/esm/chat/input/types';

export type { ChatInput };
export type { ChatInputSubmitEventDetail };
export { chatInputTag };

/**
 * Directive to provide Angular integration for the chat input.
 */
@Directive({
    selector: 'spright-chat-input'
})
export class SprightChatInputDirective {
    @Output() public submitEvent = new EventEmitter<string>();
    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ChatInput>) {}

    @HostListener('submit', ['$event'])
    public onSubmit($event: CustomEvent<ChatInputSubmitEventDetail>): void {
        if ($event.target === this.elementRef.nativeElement) {
            this.submitEvent.emit($event.detail.text);
        }
    }
}
