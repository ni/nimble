import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
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
    public get placeholder(): string | undefined {
        return this.elementRef.nativeElement.placeholder;
    }

    @Input() public set placeholder(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    public get sendButtonLabel(): string | undefined {
        return this.elementRef.nativeElement.sendButtonLabel;
    }

    @Input('send-button-label') public set sendButtonLabel(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'sendButtonLabel', value);
    }

    public get value(): string | undefined {
        return this.elementRef.nativeElement.value;
    }

    @Input() public set value(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ChatInput>) {}
}
